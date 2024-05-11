// package org.nets2120.s3Setup;

import org.apache.spark.sql.Row;
import org.apache.spark.sql.RowFactory;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.model.S3Exception;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import org.nets2120.imdbIndexer.config.Config;

public static final String AWS_REGION = "us-east-1";
public static final String S3_BUCKET_NAME = "images-upenn-nets2120";

/**
 * TODO: Populate the S3 Bucket with the embeddings.
 * Before this step, make sure that a bucket has been set up using the console.
 * Bucket Name: imdb-embeddings
 */
public class S3Setup {
    private static final S3Client s3 = S3Client.builder()
            .region(Region.of(Config.AWS_REGION))
            .build();

    /* TODO: Iterate over embeddings and add to S3 bucket */
    public static Iterator<Row> processAndUploadToS3(Iterator<Row> partitionIterator, String s3Bucket) {

        List<Row> processedRows = new ArrayList<>();

        // Iterate over the partition and write each item individually
        while (partitionIterator.hasNext()) {
            Row row = partitionIterator.next();

            /* TODO: Get embedding string and id from RDD */
            String embeddingStr = row.getAs("embedding");
            String id = row.getAs("image"); 

            /* TODO: Establish S3 URL */
            String s3Url = "https://" + s3Bucket + ".s3." + Config.AWS_REGION + ".amazonaws.com/" + id;

            // Upload to S3 
            uploadToS3(embeddingStr, s3Bucket, id);

            // Add a new Row object to the list, replacing embedding with S3 path
            processedRows.add(RowFactory.create(id, s3Url));
        }

        return processedRows.iterator();
    }

    /* TODO: Upload an embedding to s3 given their embedding, the bucket name, and unique id */
    private static void uploadToS3(String embedding, String s3Bucket, String s3Key) {

        // Upload item to S3
        try {
            /* TODO: Create PutObject request and run s3.putObject with request */
            PutObjectRequest request = PutObjectRequest.builder()
                    .bucket(s3Bucket)
                    .key(s3Key)
                    .build();
            s3.putObject(request, RequestBody.fromString(embedding));
        } catch (S3Exception e) {
            // Handle the S3 exception, log it, and propagate it
            System.err.println(e.awsErrorDetails().errorMessage()); 
            throw e;
        }
    }
}
