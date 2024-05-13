//call export 
console.log('index.js is running');
import {uploadImageToS3} from './uploadImageToS3.js';

// const imagePath = '/nets2120/project-electro-motive-diesel-sd70-ace-t4-AnushkaLev/backend/src/s3-setup/sunset.jpeg'; //path to your test image

async function uploadImage(file) {
    try {
        const s3Url = await uploadImageToS3(file);
        console.log('Image uploaded successfully:', s3Url);
        return s3Url;
    } catch (error) {
        console.error('Failed to upload image:', error);
    }
}
uploadImage(file);

import express from 'express';
import { posts_routes } from './routes/posts-routes';  // Assuming you have organized your routes in separate files

const app = express();
const port = 8080;

app.use('/posts', posts_routes);

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

