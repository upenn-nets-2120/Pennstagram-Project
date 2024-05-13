import { s3, AWS } from './s3_access.js';
import fs from 'fs'; //lets us read and write files
import path from 'path'; //for file system paths to use resolve
import config from './config.json' assert { type: "json" };

// Function to get an image from S3 and save it locally
const getImageFromS3 = (imageKey, downloadPath) => {
    console.log('getImageFromS3 called with imageKey:', imageKey);

    // Set up parameters for the S3 download
    const params = {
        Bucket: config.bucket,
        Key: imageKey,
    };

    // Download image from S3
    return new Promise((resolve, reject) => {
        s3.getObject(params, (err, data) => {
            if (err) {
                console.error('s3.getObject error:', err);
                reject(err);
            } else {
                console.log('s3.getObject success:', data);
                const filePath = path.resolve(downloadPath, path.basename(imageKey));
                fs.writeFile(filePath, data.Body, (writeErr) => {
                    if (writeErr) {
                        console.error('File write error:', writeErr);
                        reject(writeErr);
                    } else {
                        console.log('File saved successfully:', filePath);
                        resolve(filePath);
                    }
                });
            }
        });
    });
};

export default getImageFromS3;
