package edu.upenn.cis.nets2120.hw3;

import java.io.IOException;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.apache.spark.api.java.JavaPairRDD;
import org.apache.spark.api.java.JavaRDD;

import edu.upenn.cis.nets2120.config.Config;

import scala.Tuple2;

import java.util.*;
import java.lang.Math;
import java.util.stream.Collectors;
import java.io.BufferedWriter;
import java.io.FileWriter;
import java.util.Collections;



public class ComputeRanks extends SparkJob<List<Tuple2<String, Double>>> {
    /**
     * The basic logger
     */
    static Logger logger = LogManager.getLogger(ComputeRanks.class);

    // Convergence condition variables
    protected double d_max; // largest change in a node's rank from iteration i to iteration i+1
    protected int i_max; // max number of iterations
    int max_answers = 1000;

    public ComputeRanks(double d_max, int i_max, int answers, boolean debug) {
        super(true, true, debug);
        this.d_max = d_max;
        this.i_max = i_max;
        this.max_answers = answers;
        System.out.println("REACHED HERE");
    }

    /**
     * Fetch the social network from the S3 path, and create a (followed, follower)
     * edge graph
    //creates a (followed, follower) pair because the rank of a node is determined by the number of nodes that follow it
    //ex: if A -> B, B's rank influences A's rank
     * @param filePath
     * @return JavaPairRDD: (followed: String, follower: String)
     */
    protected JavaPairRDD<String, String> getSocialNetwork(String filePath) {
        // TODO 
        //Load the file filePath into an RDD (take care to handle both spaces and tab characters as separators)
        //The data is in the format of (follower, followed). The homework wants you to parse it into (followed, follower).
        JavaRDD<String> file = context.textFile(filePath, Config.PARTITIONS);
        JavaPairRDD<String, String> socialNetwork = file.mapToPair(line -> {
            String[] data = line.split("\\s+"); 
            return new Tuple2<>(data[1], data[0]); //create (followed, follower) pair
        });
        return socialNetwork;
    }
    /**
     * Retrieves the sinks in the provided graph.
     *
     * @param network The input graph represented as a JavaPairRDD.
     * @return A JavaRDD containing the nodes with no outgoing edges.
     */
    protected JavaRDD<String> getSinks(JavaPairRDD<String, String> network) {
        // TODO Find the sinks in the provided graph
        JavaRDD<String> allNodes = network.keys().union(network.values()).distinct();
        JavaRDD<String> nonSinkNodes = network.values().distinct();
        return allNodes.subtract(nonSinkNodes);
    }

    /**
     * Main functionality in the program: read and process the social network
     * Runs the SocialRank algorithm to compute the ranks of nodes in a social network.
     *
     * @param debug a boolean value indicating whether to enable debug mode
     * @return a list of tuples containing the node ID and its corresponding SocialRank value
     * @throws IOException          if there is an error reading the social network data
     * @throws InterruptedException if the execution is interrupted
     */
    public List<Tuple2<String, Double>> run(boolean debug) throws IOException, InterruptedException {
        // Load the social network, aka. the edges (followed, follower)
        JavaPairRDD<String, String> edgeRDD = getSocialNetwork(Config.SOCIAL_NET_PATH);

        //find the sinks in edgeRDD
        JavaRDD<String> sinks = getSinks(edgeRDD);
        logger.info("There are {} sinks", sinks.count());
       
        JavaPairRDD<String, String> sinksPairRDD = sinks.mapToPair(t -> new Tuple2<>(t, t));
        JavaPairRDD<String, Tuple2<String, String>> join = sinksPairRDD.join(edgeRDD);
        JavaPairRDD<String, String> backlinksRDD = join.mapToPair(t -> new Tuple2<>(t._2._2, t._1)); 
        //add backlinks to edgeRDD and get all distinct key-value pairs from both
        edgeRDD = edgeRDD.union(backlinksRDD).distinct();
        //logger.info("There are {} reverse edges", reversedEdgeRDD.count());
        logger.info("There are {} backlinks", backlinksRDD.count());
        logger.info("There are {} edges in new edgeRDD", edgeRDD.count());

        //initialize ranks of each node to 1
        edgeRDD = edgeRDD.mapToPair(t -> new Tuple2<>(t._2, t._1));
        JavaPairRDD<String, Double> ranks = edgeRDD.mapValues(v -> 1.0);
        //get number of followers for each node (out-degree)
        JavaPairRDD<String, Double> divideRDD = ranks.reduceByKey((x, y) -> x + y).mapToPair(t -> new Tuple2<>(t._1, 1.0 / t._2)); //1/|N(j)|
        JavaPairRDD<String, Tuple2<String, Double>> results = edgeRDD.join(divideRDD); //(edge, transferred edge)

        //System.out.println("results : " + results.collect());



        ranks = edgeRDD.mapValues(v -> 1.0).distinct();

        int iterationCount =0;
        boolean continueLoop = true;
        JavaPairRDD<String, Double> newRanks = ranks;
        while (continueLoop) {

           

            JavaPairRDD<String, Double> n = results.join(ranks).mapToPair(t -> new Tuple2<>(t._2._1._1, t._2._2 * t._2._1._2)); //need to join for each rank so use mapToPair //1/|N(j)| * r_j --> (node, (outgoing edge/divideRDD value, rankValue))
            JavaPairRDD<String, Double> summation = n.reduceByKey((a,b) -> a + b); //for each node, sum up all values for that node // \sum_{j\in B(i)} 1/|N(j)| * r_j
            newRanks = summation.mapValues(sum -> 0.15 + sum * 0.85); // 0.15 + \sum_{j\in B(i)} 1/|N(j)| * r_j * 0.85
            
            //reducesByKey and sume up contributes of followed nodes to follower node's rank
            //JavaPairRDD<String, Double> contributions = flatMappedRDD.reduceByKey((x, y) -> x + y);
            
            //System.out.println("n " + iterationCount + ": " + n.collect());

            
            System.out.println("Ranks at iteration " + iterationCount + ": " + newRanks.collect());

            final double final_d_max = d_max;

            double[] maxval = {0.0};

            JavaPairRDD<String, Double> diff = newRanks.join(ranks)
                .mapValues(t -> Math.abs(t._1 - t._2)); 

            diff.foreach(t -> {
                if (t._2 > maxval[0]) {
                    maxval[0] = t._2;
                }
            });

            if (maxval[0] < final_d_max || iterationCount >= i_max) {
                break;
            }
                

            ranks = newRanks;
            iterationCount++;
            
        }
        logger.info("Number of iterations" + iterationCount);
// Collect the newRanks RDD to a list
List<Tuple2<String, Double>> allNewRanks = new ArrayList<>(newRanks.collect());

// Sort the list in descending order of rank
allNewRanks.sort((t1, t2) -> t2._2.compareTo(t1._2));

// Take the top 1000 elements
List<Tuple2<String, Double>> topNewRanks = allNewRanks.subList(0, Math.min(allNewRanks.size(), 1000));

// Write the top ranks to a file
try (BufferedWriter writer = new BufferedWriter(new FileWriter("socialrank-local.csv"))) {
    for (Tuple2<String, Double> rank : topNewRanks) {
        writer.write(rank._1 + " " + rank._2);
        writer.newLine();
    }
} catch (IOException e) {
    System.err.println("Error writing to file: " + e.getMessage());
}

return topNewRanks;
    }
}