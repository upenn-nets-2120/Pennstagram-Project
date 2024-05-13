import React from 'react';

interface PostProps {
  post: {
    username: string;
    image?: string;
    caption?: string;
  };
}

const Post: React.FC<PostProps> = ({ post }) => {
  return (
    <div>
      <h3>{post.username}</h3>
      {post.image && <img src={post.image} alt="Post" />}
      {post.caption && <p>{post.caption}</p>}
    </div>
  );
};

export default Post;