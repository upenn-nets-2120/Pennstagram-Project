import { FriendTabOption } from './FriendTabOption';

export interface User {
    userID: number;
    firstName: string;
    lastName: string;
    profilePic: string;
    online?: boolean;
    relationship?: FriendTabOption;
}