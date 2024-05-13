import React, { useState } from 'react';
import { NavBar } from '../../components';
import config from '../../config.json';
import axios from 'axios';

const PostPage: React.FC = () => {
const rootURL = config.serverRootURL;
console.log("rootURL: ", rootURL);

  const [content, setContent] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [postVisibility, setPostVisibility] = useState('everyone');

  const handleImageUpload = async () => {
    if (!image) {
        return null;
    }
    console.log("image not null");
    const formData = new FormData();
    formData.append('image', image);

    //http://localhost:3000/
    //http://localhost:8080/

    try {
        const response = await axios.post(`${rootURL}/posts/uploadImage`, formData);
        console.log("after response " + response);
        console.log("response.data.url: " + response.data.url)
        return response.data.url;
    } catch (error) {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      console.log(error.response.data);
      console.log(error.response.status);
      console.log(error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      console.log(error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log('Error', error.message);
    }
    console.log(error.config);
  }
  throw error;
}
  };

const handleSubmit = async (event: React.FormEvent) => {
  event.preventDefault();

  console.log('handleSubmit called');

  try {
    const imageUrl = await handleImageUpload();
    console.log('Image uploaded, URL:', imageUrl);

    const postData = {
      content,
      imageUrl,
      postVisibility,
    };
    console.log('Post data:', postData);

    const response = await axios.post(`${rootURL}/posts/newPost`, postData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('Response from server:', response);
  } catch (error) {
    console.error('Error in handleSubmit:', error);
    if (axios.isAxiosError(error)) {
      if (error.response) {
        console.log('Server responded with status:', error.response.status);
        console.log('Response data:', error.response.data);
        console.log('Response headers:', error.response.headers);
      } else if (error.request) {
        console.log('Request made but no response received');
        console.log('Request:', error.request);
      } else {
        console.log('Error setting up request:', error.message);
      }
      console.log('Config:', error.config);
    }
    throw error;
  }
};

  return (
    <>
      <NavBar />
      <div style={{ margin: '0 auto', maxWidth: '600px', padding: '1em' }}>
        <h1 style={{ textAlign: 'center' }}>Post Page</h1>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1em' }}>
          <label>
            Content:
            <textarea value={content} onChange={e => setContent(e.target.value)} style={{ width: '100%', minHeight: '100px' }} />
          </label>
          <label>
            Image:
            <input type="file" onChange={e => setImage(e.target.files ? e.target.files[0] : null)} />
          </label>
          <label>
            Visibility:
            <select value={postVisibility} onChange={e => setPostVisibility(e.target.value)}>
              <option value="everyone">Everyone</option>
              <option value="private">Private</option>
              <option value="followers">Followers</option>
            </select>
          </label>
          <input type="submit" value="Create Post" />
        </form>
      </div>
    </>
  );
};

export default PostPage;