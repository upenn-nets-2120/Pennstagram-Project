import { Comment } from './Comment';
import { User } from './User';

export type Post = {
    postId: number;
    user: User;
    imageUrl: string;
    caption: string;
    likes: number;
    visibility: 'everyone' | 'private' | 'followers';
    comments: Comment[];
};

