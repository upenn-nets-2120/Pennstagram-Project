import AWS from 'aws-sdk';
import fs from 'fs';
import path from 'path';

//set up AWS configuration
AWS.config.update({ region: 'us-east-1' });

//create an S3 instance
const s3 = new AWS.S3();

//function to upload an image to S3 and return its public URL
function uploadImageToS3(imagePath) {
    //generate a unique key for the uploaded image (based on timestamp)
    const key = `images/${Date.now()}-${path.basename(imagePath)}`;

    //read the image file as a stream -- double check if this is reall
    const fileStream = fs.createReadStream(imagePath);

    //set up parameters for the S3 upload
    const params = {
        Bucket: 'images-upenn-nets2120',
        Key: key,
        Body: fileStream,
        ContentType: 'image/jpeg'
    };

    //upload image to S3
    return new Promise((resolve, reject) => {
        s3.upload(params, (err, data) => {
            if (err) {
                reject(err);
            } else {
                const s3Url = `https://${params.Bucket}.s3.${AWS.config.region}.amazonaws.com/${key}`;
                resolve(s3Url); //return the HTTPS S3 URL i think
            }
        });
    });
}

export {uploadImageToS3};