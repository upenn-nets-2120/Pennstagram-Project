package .livy;

import java.io.IOException;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.apache.livy.JobContext;
import org.apache.spark.api.java.JavaPairRDD;
import org.apache.spark.api.java.JavaRDD;

import edu.upenn.cis.nets2120.config.Config;
import edu.upenn.cis.nets2120.hw3.SparkJob;
import scala.Tuple2;
import java.util.stream.Collectors;
import java.util.ArrayList;
import java.io.BufferedWriter;
import java.io.FileWriter;

public class SocialRankJob extends SparkJob<List<MyPair<String, Double>>> {
    /**
     *
     */
    private static final long serialVersionUID = 1L;

    private boolean useBacklinks;
    // Convergence condition variables
    protected double d_max; // largest change in a node's rank from iteration i to iteration i+1
    protected int i_max; // max number of iterations

    private String source;

    int max_answers = 1000;

    public SocialRankJob(double d_max, int i_max, int answers, boolean useBacklinks, boolean debug) {
        super(false, false, debug);
        this.useBacklinks = useBacklinks;
        this.d_max = d_max;
        this.i_max = i_max;
        this.max_answers = answers;
    }

    /**
     * Fetch the social network from the S3 path, and create a (followed, follower)
     * edge graph
     *
     * @param filePath
     * @return JavaPairRDD: (followed: String, follower: String)
     */
    protected JavaPairRDD<String, String> getSocialNetwork(String filePath) {
        JavaRDD<String> file = context.textFile(filePath, Config.PARTITIONS);
        JavaPairRDD<String, String> socialNetwork = file.mapToPair(line -> {
            String[] data = line.split("\\s+"); 
            return new Tuple2<>(data[1], data[0]); //create (followed, follower) pair
        });
        return socialNetwork;
    }

    /**
     * Retrieves the sinks from the given network.
     *
     * @param network the input network represented as a JavaPairRDD
     * @return a JavaRDD containing the nodes with no outgoing edges (sinks)
     */
    protected JavaRDD<String> getSinks(JavaPairRDD<String, String> network) {
        JavaRDD<String> allNodes = network.keys().union(network.values()).distinct();
        JavaRDD<String> nonSinkNodes = network.values().distinct();
        return allNodes.subtract(nonSinkNodes);
    }

    /**
     * Main functionality in the program: read and process the social network
     * Runs the SocialRankJob and returns a list of the top 10 nodes with the highest SocialRank values.
     *
     * @param debug a boolean indicating whether to enable debug mode
     * @return a list of MyPair objects representing the top 10 nodes with their corresponding SocialRank values
     * @throws IOException          if there is an error reading the social network file
     * @throws InterruptedException if the execution is interrupted
     */
    public List<MyPair<String, Double>> run(boolean debug) throws IOException, InterruptedException {
        System.out.println("Running");

        // Load the social network, aka. the edges (followed, follower)
        JavaPairRDD<String, String> edgeRDD = getSocialNetwork(Config.SOCIAL_NET_PATH);

        // Find the sinks in edgeRDD as PairRDD
        JavaRDD<String> sinks = getSinks(edgeRDD);
        System.out.println("There are " + sinks.count() + " sinks");

        if (useBacklinks) {
            JavaPairRDD<String, String> sinksPairRDD = sinks.mapToPair(t -> new Tuple2<>(t, t));
            JavaPairRDD<String, Tuple2<String, String>> join = sinksPairRDD.join(edgeRDD);
            JavaPairRDD<String, String> backlinksRDD = join.mapToPair(t -> new Tuple2<>(t._2._2, t._1)); 
        //add backlinks to edgeRDD and get all distinct key-value pairs from both
            edgeRDD = edgeRDD.union(backlinksRDD).distinct();
        } else {
            edgeRDD = edgeRDD.distinct();
        }


        // Your code from ComputeRanks here
    // Initialize ranks of each node to 1
    edgeRDD = edgeRDD.mapToPair(t -> new Tuple2<>(t._2, t._1));
    JavaPairRDD<String, Double> ranks = edgeRDD.mapValues(v -> 1.0);

    // Get number of followers for each node (out-degree)
    JavaPairRDD<String, Double> divideRDD = ranks.reduceByKey((x, y) -> x + y).mapToPair(t -> new Tuple2<>(t._1, 1.0 / t._2)); // 1/|N(j)|
    JavaPairRDD<String, Tuple2<String, Double>> results = edgeRDD.join(divideRDD); // (edge, transferred edge)

    ranks = edgeRDD.mapValues(v -> 1.0).distinct();

        int iterationCount = 0;
        boolean continueLoop = true;
        JavaPairRDD<String, Double> newRanks = ranks;
        while (continueLoop) {
            JavaPairRDD<String, Double> n = results.join(ranks).mapToPair(t -> new Tuple2<>(t._2._1._1, t._2._2 * t._2._1._2)); // need to join for each rank so use mapToPair // 1/|N(j)| * r_j --> (node, (outgoing edge/divideRDD value, rankValue))
            JavaPairRDD<String, Double> summation = n.reduceByKey((a, b) -> a + b); // for each node, sum up all values for that node // \sum_{j\in B(i)} 1/|N(j)| * r_j
            newRanks = summation.mapValues(sum -> 0.15 + sum * 0.85); // 0.15 + \sum_{j\in B(i)} 1/|N(j)| * r_j * 0.85

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

        System.out.println("Number of iterations: " + iterationCount);

        //collect newRanks RDD in a list
        List<Tuple2<String, Double>> allNewRanks = new ArrayList<>(newRanks.collect());
        allNewRanks.sort((t1, t2) -> t2._2.compareTo(t1._2)); //descending order
        List<Tuple2<String, Double>> topNewRanks = allNewRanks.subList(0, Math.min(allNewRanks.size(), 10)); //top 10

        //convert tuples MyPair objects
        List<MyPair<String, Double>> topNewRanksMyPair = topNewRanks.stream()
            .map(tuple -> new MyPair<>(tuple._1, tuple._2))
            .collect(Collectors.toList());

        SocialRankJob jobWithoutBacklinks = new SocialRankJob(d_max, i_max, max_answers, false, debug);
        List<MyPair<String, Double>> resultsWithoutBacklinks = jobWithoutBacklinks.run(debug);

        try (BufferedWriter writer = new BufferedWriter(new FileWriter("socialrank-livy-nobacklinks.csv"))) {
            for (MyPair<String, Double> pair : resultsWithoutBacklinks) {
                writer.write(pair.toString());
                writer.newLine();
            }
        } catch (IOException e) {
            System.err.println("Error writing to file: " + e.getMessage());
        }

        Set<String> commonNodes = new HashSet<>();  //store the common nodes
        Set<String> nodesWithBacklinks = new HashSet<>(); //back link nodes
        Set<String> nodesWithoutBacklinks = new HashSet<>(); //no backlink nodes

        for (MyPair<String, Double> pair : topNewRanksMyPair) {
            String key = pair.toString().split(",")[0];  
            if (resultsWithoutBacklinks.contains(pair)) {
                commonNodes.add(key);
            } else {
                nodesWithBacklinks.add(key);
            }
        }
        for (MyPair<String, Double> pair : resultsWithoutBacklinks) {
            String key = pair.toString().split(",")[0];
            if (!commonNodes.contains(key)) {
                nodesWithoutBacklinks.add(key);
            }
        }
        try (BufferedWriter writer = new BufferedWriter(new FileWriter("socialrank-livy-results.txt"))) {
            writer.write("Nodes in both lists: " + String.join(",", commonNodes));
            writer.newLine();
            writer.write("Nodes exclusive to the computation with back-links: " + String.join(",", nodesWithBacklinks));
            writer.newLine();
            writer.write("Nodes exclusive to the computation without back-links: " + String.join(",", nodesWithoutBacklinks));
        } catch (IOException e) {
            System.err.println("Error writing to file: " + e.getMessage());
        }

        return topNewRanksMyPair;
    }
    @Override
    public List<MyPair<String, Double>> call(JobContext arg0) throws Exception {
        initialize();
        return run(false);
    }

}
