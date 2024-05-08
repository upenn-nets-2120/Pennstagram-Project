package edu.upenn.cis.nets2120.hw3.livy;

import java.io.IOException;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.Random;


import org.apache.livy.Job;
import org.apache.livy.JobContext;
import org.apache.spark.api.java.JavaPairRDD;
import org.apache.spark.api.java.JavaRDD;
import org.apache.spark.api.java.function.PairFlatMapFunction;
import org.apache.spark.api.java.function.PairFunction;

import edu.upenn.cis.nets2120.config.Config;
import edu.upenn.cis.nets2120.hw3.SparkJob;
import scala.Tuple2;
import java.io.BufferedWriter;
import java.io.FileWriter;

public class SocialRankJob extends SparkJob<List<MyPair<String, Double>>> {

    private static final long serialVersionUID = 1L;

    private boolean useBacklinks;
    protected double d_max;
    protected int i_max;

    public SocialRankJob(double d_max, int i_max, boolean useBacklinks, boolean debug) {
        super(false, false, debug);
        this.useBacklinks = useBacklinks;
        this.d_max = d_max;
        this.i_max = 15;
    }

    protected JavaPairRDD<String, String> getSocialNetwork(String filePath) {
        //read data from the input file
        JavaRDD<String> file = context.textFile(filePath, Config.PARTITIONS);

        //parse each line of the input file to create edges for the graph
        JavaPairRDD<String, String> socialNetwork = file.flatMapToPair(line -> {
            String[] data = line.split("\\s+");
            List<Tuple2<String, String>> edges = new ArrayList<>();

            //for each line, create multiple edges based on the specified relationships (below -- specificed in writeup)
            String user = data[0];
            String entity = data[1];

            //user-hashtag relationship
            if (entity.startsWith("hashtag")) {
                edges.add(new Tuple2<>(user, entity));
                edges.add(new Tuple2<>(entity, user)); //reverse edge
            }

            //hashtag-post relationship
            else if (entity.startsWith("post")) {
                edges.add(new Tuple2<>(entity, user));
                edges.add(new Tuple2<>(user, entity)); //reverse edge
            }

            //user-post relationship
            else if (entity.startsWith("user")) {
                edges.add(new Tuple2<>(user, entity));
                edges.add(new Tuple2<>(entity, user)); //reverse edge
            }

            //user-user relationship (friends)
            else if (entity.startsWith("friend")) {
                edges.add(new Tuple2<>(user, entity));
                edges.add(new Tuple2<>(entity, user)); //reverse edge
            }

            return edges.iterator();
        });
        return socialNetwork; //return the JavaPairRDD taht represents the social network graph
    }

    protected JavaRDD<String> getSinks(JavaPairRDD<String, String> network) {
        JavaRDD<String> allNodes = network.keys().union(network.values()).distinct();
        JavaRDD<String> nonSinkNodes = network.values().distinct();
        return allNodes.subtract(nonSinkNodes);
    }

//adsorption algorithm implemneted in helper function instead of run
private JavaPairRDD<String, Double> adsorption(JavaPairRDD<String, String> edgeRDD) {
    JavaPairRDD<String, Double> ranks = edgeRDD.keys().distinct().mapToPair(node -> new Tuple2<>(node, 1.0 / edgeRDD.count())); //initialize ranks uniformly
    JavaPairRDD<String, Double> oldRanks = null;

    for (int i = 0; i < i_max; i++) {
        if (oldRanks != null) {
            //convergence check (sum of absolute differences between old and new ranks)
            double convergence = ranks.join(oldRanks)
                                      .mapValues(pair -> Math.abs(pair._1 - pair._2))
                                      .values()
                                      .reduce(Double::sum);

            if (convergence < d_max) {
                System.out.println("Converged at iteration " + i + " with convergence value: " + convergence);
                break;
            }
        }

        JavaPairRDD<String, Double> newRanks = updateRanks(ranks, edgeRDD);
        double norm = newRanks.values().reduce(Double::sum);
        newRanks = newRanks.mapValues(rank -> rank / norm);  //normalize the ranks
        oldRanks = ranks;
        ranks = newRanks;
    }
    return ranks;
}

    //update the ranks in each iteration of the adsorption algorithm
    private JavaPairRDD<String, Double> updateRanks(JavaPairRDD<String, Double> ranks, JavaPairRDD<String, String> edgeRDD) {
        double totalWeightH = 0.3;
        double totalWeightP = 0.4;
        double totalWeightU = 0.3;
    
        //update ranks based on the weights assigned to the edges
        JavaPairRDD<String, Double> newRanks = ranks.flatMapToPair(pair -> {
            List<Tuple2<String, Double>> updatedRanks = new ArrayList<>();
    
            String node = pair._1();
            double rank = pair._2();
    
            //filter edges based on the type of the destination node
            JavaPairRDD<String, Double> outgoingEdges = edgeRDD.filter(edge -> edge._1().equals(node))
                    .mapToPair(edge -> new Tuple2<>(edge._2(), 1.0)); //convert node labels to doubles
    
            //count the number of outgoing edges for normalization
            long numOfOutgoingEdges = outgoingEdges.count();
    
            //assign weights based on the type of the destination node (hashtage, post, or user)
            outgoingEdges.foreach(edge -> {
                String destination = edge._1();
                double weight;
                if (destination.startsWith("hashtag")) {
                    weight = totalWeightH / numOfOutgoingEdges;
                } else if (destination.startsWith("post")) {
                    weight = totalWeightP / numOfOutgoingEdges;
                } else {
                    weight = totalWeightU / numOfOutgoingEdges;
                }
                updatedRanks.add(new Tuple2<>(destination, rank * weight));
            });
    
            return updatedRanks.iterator();
        });
    
        return newRanks.reduceByKey((a, b) -> a + b);
    }

    //method to actually run the spark job
    public List<MyPair<String, Double>> run(boolean debug) throws IOException, InterruptedException {
        initialize();

        //to actually build the graph
        JavaPairRDD<String, String> edgeRDD = getSocialNetwork(Config.SOCIAL_NET_PATH);
        JavaRDD<String> sinks = getSinks(edgeRDD);

        //if backlinks, add them to the graph
        if (useBacklinks) {
            JavaPairRDD<String, String> sinksPairRDD = sinks.mapToPair(t -> new Tuple2<>(t, t));
            JavaPairRDD<String, Tuple2<String, String>> join = sinksPairRDD.join(edgeRDD);
            JavaPairRDD<String, String> backlinksRDD = join.mapToPair(t -> new Tuple2<>(t._2()._2(), t._1()));
            edgeRDD = edgeRDD.union(backlinksRDD).distinct();
        } else {
            edgeRDD = edgeRDD.distinct();
        }

        JavaPairRDD<String, Double> ranks = adsorption(edgeRDD); //run the adsoprtion algo
        List<MyPair<String, Double>> result = ranks.map(pair -> new MyPair<>(pair._1(), pair._2())).collect(); //collect the results
        return result;
    }

    public String recommendArticle(JavaPairRDD<String, Double> ranks, List<String> potentialArticles, List<String> recommendedArticles) {
        //filter the potential articles
        List<String> filteredArticles = potentialArticles.stream()
            .filter(article -> !recommendedArticles.contains(article))
            .collect(Collectors.toList());

        //normalize the adsorption-derived weights on these articles
        double totalWeight = ranks.filter(pair -> filteredArticles.contains(pair._1())).map(pair -> pair._2()).reduce((a, b) -> a + b);
        JavaPairRDD<String, Double> normalizedRanks = ranks.mapValues(rank -> rank / totalWeight);

        //create a weighted random distribution
        List<Tuple2<String, Double>> weightedDistribution = normalizedRanks.collect();
        double random = new Random().nextDouble();
        double cumulativeWeight = 0.0;
        for (Tuple2<String, Double> pair : weightedDistribution) {
            cumulativeWeight += pair._2();
            if (random < cumulativeWeight) {
                return pair._1();
            }
        }

        return null; //no article could be recommended
    }
}

