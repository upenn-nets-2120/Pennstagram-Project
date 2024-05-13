import { User } from './User';

export type Comment = {
    commentId: number;
    postId: number;
    userId: User;
    content: string;
    parentId: number | null; 
};