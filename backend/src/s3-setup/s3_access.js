//establish connection and pass S3 to uploadImageToS3
import AWS from 'aws-sdk';
AWS.config.update({region: 'us-east-1'});

const s3 = new AWS.S3();

export {
    s3, AWS
};
