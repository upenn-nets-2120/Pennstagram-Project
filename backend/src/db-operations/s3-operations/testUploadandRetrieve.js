console.log('testUpload.js is running');
import { uploadImageToS3, getImageFromS3 } from './index.js';

const localImagePath = '/nets2120/project-electro-motive-diesel-sd70-ace-t4/backend/src/s3-operations/sunset.jpeg'; // path to your test image
const s3ImagePath = '1715552042691-sunset.jpeg'; // path to the test image in s3 bucket
const downloadPath = './imageDownloads';

async function uploadImage(imagePath) {
    try {
        const s3Url = await uploadImageToS3(imagePath);
        console.log('Image uploaded successfully:', s3Url);
        return s3Url;
    } catch (error) {
        console.error('Failed to upload image:', error);
    }
}

async function getImage(imagePath, downloadPath) {
    try {
        const s3Url = await getImageFromS3(imagePath, downloadPath);
        console.log('Image uploaded successfully:', s3Url);
        return s3Url;
    } catch (error) {
        console.error('Failed to upload image:', error);
    }
}

// main

// uploadImage(imagePath);
getImage(s3ImagePath, downloadPath);
