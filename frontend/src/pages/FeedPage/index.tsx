import React, { useState } from 'react';
import styled from 'styled-components';
import localImage from '../../assets/sunset.jpeg';
import {NavBar} from '../../components';
import { Link } from 'react-router-dom';

//import localImage from '../assets/sunset.jpeg';
//import localImage from '/frontend/src/assets/sunset.jpeg'; 

const FeedContainer = styled.div`
  width: 80%;
  margin: auto;
  padding-top: 20px;
`;

const PostContainer = styled.div`
  background: #fff;
  border: 1px solid #ccc;
  border-radius: 8px;
  margin-bottom: 20px;
  padding: 15px;
`;

const PostHeader = styled.div`
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 10px;
`;

const PostImage = styled.img`
  width: 100%;
  border-radius: 8px;
  margin-bottom: 10px;
`;

const PostText = styled.div`
  margin-bottom: 10px;
`;

const InteractionContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Button = styled.button.attrs<{ active?: boolean }>(props => ({
  active: props.active,
}))`
  padding: 5px 10px;
  border-radius: 5px;
  border: none;
  cursor: pointer;

  background-color: ${props => props.active ? 'red' : 'initial'};
  color: ${props => props.active ? 'white' : 'initial'};

  &:hover {
    background-color: #007bff;
    color: white;
  }
`;

const LoadMoreButton = styled(Button)`
  width: 100%;
  margin-top: 20px;
`;

const CommentList = styled.div`
  background-color: #f0f2f5;
  padding: 10px;
  border-radius: 8px;
`;

const Comment = styled.div`
  padding: 5px;
  border-bottom: 1px solid #ddd;
  &:last-child {
    border-bottom: none;
  }
`;

const NewPostForm = styled.form`
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
`;

const TextArea = styled.textarea`
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
`;

const Sidebar = styled.div`
  position: fixed;
  right: 0;
  width: 7%;
  height: 100vh;
  background: #f0f2f5;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const FeedPage: React.FC = () => {
  const [posts, setPosts] = useState([
    { id: 1, author: 'Alice', content: 'What a beautiful sunset!', imageUrl: localImage, liked: false, comments: [{ id: 1, text: 'Absolutely stunning!', author: 'Bob' }] },
    { id: 2, author: 'Charlie', content: 'Anyone up for a hike?', imageUrl: '', liked: false, comments: [] },
    { id: 3, author: 'Eve', content: 'Exploring the new cafe in town.', imageUrl: '', liked: false, comments: [] },
    { id: 4, author: 'David', content: 'Can anyone recommend a good book?', imageUrl: '', liked: false, comments: [] },
    { id: 5, author: 'Fiona', content: 'Loving the weather today!', imageUrl: '', liked: false, comments: [] }
  ]);
  const [visibleCount, setVisibleCount] = useState(2); // Number of posts to show initially
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostImage, setNewPostImage] = useState('');
  const [username, setUsername] = useState('');

  const handleNewPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPostContent.trim()) {
      const newPost = {
        id: posts.length + 1,
        author: username,
        content: newPostContent,
        imageUrl: newPostImage || localImage,
        liked: false,
        comments: [],
      };
      setPosts([newPost, ...posts]);
      setNewPostContent('');
      setNewPostImage('');
    }
  };

  const toggleLike = (id: number) => {
    const updatedPosts = posts.map(post =>
      post.id === id ? { ...post, liked: !post.liked } : post
    );
    setPosts(updatedPosts);
  };

  const loadMorePosts = () => {
    setVisibleCount(prevCount => Math.min(prevCount + 2, posts.length));//load in 2 posts if needed
  };

  return (
    <>
    <NavBar />
    <Sidebar>
    <Link to="/post">
      <Button>Create Post</Button>
    </Link>
    <Link to="/post">
      <Button>Update Post</Button>
    </Link>
    <Link to="/post">
      <Button>Delete Post</Button>
    </Link>
    </Sidebar>
    <FeedContainer>
      <NewPostForm onSubmit={handleNewPost}>
        <TextArea placeholder="Post new..." value={newPostContent} onChange={(e) => setNewPostContent(e.target.value)} />
        <Button type="submit">Post</Button>
      </NewPostForm>
      {posts.slice(0, visibleCount).map(post => (
        <PostContainer key={post.id}>
          <PostHeader>{post.author}</PostHeader>
          {post.imageUrl && <PostImage src={post.imageUrl} alt="Post" />}
          <PostText>{post.content}</PostText>
          <InteractionContainer>
            <Button onClick={() => toggleLike(post.id)} active={post.liked}>Like</Button>
          </InteractionContainer>
          {post.comments.length > 0 && (
            <CommentList>
              {post.comments.map(comment => (
                <Comment key={comment.id}>{comment.author}: {comment.text}</Comment>
              ))}
            </CommentList>
          )}
        </PostContainer>
      ))}
      {visibleCount < posts.length && <LoadMoreButton onClick={loadMorePosts}>Load More</LoadMoreButton>}
    </FeedContainer>
    </>
  );
};

export default FeedPage;

/*import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import localImage from '../../assets/sunset.jpeg';
import {NavBar} from '../../components';
import axios from 'axios';
// import { Post } from '../../../entities/Post';
import { Comment } from '../../../entities/Comment';

//import localImage from '../assets/sunset.jpeg';
//import localImage from '/frontend/src/assets/sunset.jpeg'; 

const FeedContainer = styled.div`
  width: 80%;
  margin: auto;
  padding-top: 20px;
`;

const PostContainer = styled.div`
  background: #fff;
  border: 1px solid #ccc;
  border-radius: 8px;
  margin-bottom: 20px;
  padding: 15px;
`;

const PostHeader = styled.div`
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 10px;
`;

const PostImage = styled.img`
  width: 100%;
  border-radius: 8px;
  margin-bottom: 10px;
`;

const PostText = styled.div`
  margin-bottom: 10px;
`;

const InteractionContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Button = styled.button.attrs<{ active?: boolean }>(props => ({
  active: props.active,
}))`
  padding: 5px 10px;
  border-radius: 5px;
  border: none;
  cursor: pointer;

  background-color: ${props => props.active ? 'red' : 'initial'};
  color: ${props => props.active ? 'white' : 'initial'};

  &:hover {
    background-color: #007bff;
    color: white;
  }
`;

const LoadMoreButton = styled(Button)`
  width: 100%;
  margin-top: 20px;
`;

const CommentList = styled.div`
  background-color: #f0f2f5;
  padding: 10px;
  border-radius: 8px;
`;

const Comments = styled.div`
  padding: 5px;
  border-bottom: 1px solid #ddd;
  &:last-child {
    border-bottom: none;
  }
`;

const NewPostForm = styled.form`
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
`;

const TextArea = styled.textarea`
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
`;

const Sidebar = styled.div`
  position: fixed;
  right: 0;
  width: 20%;
  height: 100vh;
  background: #f0f2f5;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const FeedPage: React.FC = () => {
  const [posts, setPosts] = useState([]);
    const [visibleCount, setVisibleCount] = useState(5);
    const [newComment, setNewComment] = useState('');
    const [newCommentParentId, setNewCommentParentId] = useState(null);
  
    useEffect(() => {
      // Fetch posts from API
      axios.get('/api/posts?visibility=public')
        .then(response => {
          setPosts(response.data);
        });
    }, []);

  const handleNewComment = (postId: number) => {
    // Post new comment to API
    axios.post(`http://localhost:8080/posts/commentPost/${postId}`, {
      content: newComment,
      parentId: newCommentParentId
    })
      .then(response => {
        // Update posts with new comment
        setPosts(posts.map(post =>
          post.id === postId ? { ...post, comments: [...post.comments, response.data] } : post
        ));
        setNewComment('');
        setNewCommentParentId(null);
      });
  };

  const handleLike = (postId: number) => {
    // Post like to API
    axios.post(`/api/posts/${postId}/likes`)
      .then(response => {
        // Update posts with new like
        setPosts(posts.map(post =>
          post.id === postId ? { ...post, likes: [...post.likes, response.data] } : post
        ));
      });
  };

  const loadMorePosts = () => {
    setVisibleCount(prevCount => Math.min(prevCount + 5, posts.length));
  };

  return (
      <>
        <NavBar />
        <Sidebar>
        <Button onClick={handleCreatePost}>Create Post</Button>
        <Button onClick={handleUpdatePost}>Update Post</Button>
        <Button onClick={handleDeletePost}>Delete Post</Button>
      </Sidebar>
        <FeedContainer>
        {posts.slice(0, visibleCount).map(post => (
        <PostContainer key={post.id}>
          <PostHeader>{post.author}</PostHeader>
          {post.imageUrl && <PostImage src={post.imageUrl} alt="Post" />}
          <PostText>{post.content}</PostText>
          <InteractionContainer>
            <Button onClick={() => handleLike(post.id)}>Like</Button>
            <form onSubmit={() => handleNewComment(post.id)}>
              <input type="text" value={newComment} onChange={(e) => setNewComment(e.target.value)} />
              <Button type="submit">Comment</Button>
            </form>
          </InteractionContainer>
          {post.comments.map(comment => (
            <Comment key={comment.id}>{comment.content}</Comment>
          ))}
        </PostContainer>
      ))}
      {visibleCount < posts.length && <LoadMoreButton onClick={loadMorePosts}>Load More</LoadMoreButton>}
        </FeedContainer>
      </>
  );
};

export default FeedPage;


/*<>
    <NavBar />
    <FeedContainer>
      <NewPostForm onSubmit={handleNewPost}>
        <TextArea placeholder="Post new..." value={newPostContent} onChange={(e) => setNewPostContent(e.target.value)} />
        <Button type="submit">Post</Button>
      </NewPostForm>
      {posts.slice(0, visibleCount).map(post => (
        <PostContainer key={post.id}>
          <PostHeader>{post.author}</PostHeader>
          {post.imageUrl && <PostImage src={post.imageUrl} alt="Post" />}
          <PostText>{post.content}</PostText>
          <InteractionContainer>
            <Button onClick={() => toggleLike(post.id)} active={post.liked}>Like</Button>
          </InteractionContainer>
          {post.comments.length > 0 && (
            <CommentList>
              {post.comments.map(comment => (
                <CommentS key={comment.id}>{comment.author}: {comment.text}</CommentS>
              ))}
            </CommentList>
          )}
        </PostContainer>
      ))}
      {visibleCount < posts.length && <LoadMoreButton onClick={loadMorePosts}>Load More</LoadMoreButton>}
    </FeedContainer>
    </>*/