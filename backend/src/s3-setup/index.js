//call export 
import {uploadImageToS3} from './uploadImageToS3.js';

async function uploadImage(imagePath) {
    try {
        const s3Url = await uploadImageToS3(imagePath);
        console.log('Image uploaded successfully:', s3Url);
        return s3Url;
    } catch (error) {
        console.error('Failed to upload image:', error);
    }
}
export {uploadImage as uploadImageToS3};
