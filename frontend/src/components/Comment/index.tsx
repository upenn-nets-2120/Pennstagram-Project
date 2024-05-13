import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface CommentProps {
  postId: number;
}

interface Comment {
  id: number;
  text: string;
  username: string;
}

const Comment: React.FC<CommentProps> = ({ postId }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(`/fetchComments/${postId}`);
        setComments(response.data);
      } catch (error) {
        console.error('Failed to fetch comments:', error);
      }
    };

    fetchComments();
  }, [postId]);

  const handleCommentChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewComment(event.target.value);
  };

  const handleCommentSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await axios.post(`/commentPost/${postId}`, { content: newComment });
      setNewComment('');
      // Refetch comments after a new comment is posted
      const response = await axios.get(`/fetchComments/${postId}`);
      setComments(response.data);
    } catch (error) {
      console.error('Failed to post comment:', error);
    }
  };

  return (
    <div>
      {comments.map((comment) => (
        <div key={comment.id}>
          <h4>{comment.username}</h4>
          <p>{comment.text}</p>
        </div>
      ))}
      <form onSubmit={handleCommentSubmit}>
        <textarea value={newComment} onChange={handleCommentChange} required />
        <button type="submit">Post Comment</button>
      </form>
    </div>
  );
};

export default Comment;