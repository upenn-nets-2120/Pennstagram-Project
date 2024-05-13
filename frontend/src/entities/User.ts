import { FriendTabOption } from './FriendTabOption';

export interface User {
    userID: number;
    username: string;
    firstName: string | null;
    lastName: string | null;
    profilePic: string | null;
    salted_password: string | null;
    emailID: string | null;
    actors: any | null;
    birthday: string | null;
    affiliation: string | null;
    linked_actor_nconst: string | null;
    hashtags: Array<string> | [];
    inviters: any | null;
    userProfilePic: string | null;
    userScore: number | null;
    userVisibility: 'public' | 'private' | null;
    sessionToken: string | null;
    follows_back: boolean | null;
    requested: boolean | null;
    online: boolean | null;
}
