import {s3, AWS} from './s3_access.js';

//function to upload an image to S3 and return its public URL
function uploadImageToS3(file) {
    console.log('uploadImageToS3 called with file:', file.originalname);
    //generate a unique key for the uploaded image (based on timestamp)
    const key = `images/${Date.now()}-${file.originalname}`;

    //set up parameters for the S3 upload
    const params = {
        Bucket: 'images-upenn-nets2120',
        Key: key, 
        Body: file.buffer,
        ContentType: file.mimetype
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
}

export { uploadImageToS3 };