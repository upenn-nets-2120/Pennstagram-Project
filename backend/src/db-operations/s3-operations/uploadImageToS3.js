import { s3, AWS } from './s3_access.js';
import fs from 'fs'; //lets us read and write files
import path from 'path'; //for file system paths to use resolve
import config from './config.json' assert { type: "json" };

//function to upload an image to S3 and return its public URL
const uploadImageToS3 = (imagePath) => {
    console.log('uploadImageToS3 called with imagePath:', imagePath);

    //generate a unique key for the uploaded image (based on timestamp)
    const postKey = `posts/${Date.now()}-${path.basename(imagePath)}`;

    //read the image file as a stream -- double check if this is reall
    const fileStream = fs.createReadStream(imagePath);

    //set up parameters for the S3 upload
    const params = {
        Bucket: config.bucket,
        Key: postKey,
        Body: fileStream,
        ContentType: 'image/jpeg'
    };

    //upload image to S3
    return new Promise((resolve, reject) => {
        s3.upload(params, (err, data) => {
            if (err) {
                console.error('s3.upload error:', err);
                reject(err);

            } else {
                console.log('s3.upload success:', data);
                const s3Url = `https://${params.Bucket}.s3.${AWS.config.region}.amazonaws.com/${key}`;
                resolve(s3Url); //return the HTTPS S3 URL i think
            }
        });
    });
};

export default uploadImageToS3;
