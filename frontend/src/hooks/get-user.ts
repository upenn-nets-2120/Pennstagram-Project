import axios from 'axios';
import { User } from "../entities/User";
import { backend_url } from '../constants/backendURL';

export const getUser = async (): Promise<User> => {
    try {
        const response = await axios.get(`${backend_url}/profile/fetchProfile`);

        const follower = response.data;

        const user: User = {
            userID: follower.userID || null,
            username: follower.username || null,
            firstName: follower.firstName || null,
            lastName: follower.lastName || null,
            profilePic: follower.userProfilePic || null,
            salted_password: follower.salted_password || null,
            emailID: follower.emailID || null,
            actors: follower.actors || null,
            birthday: follower.birthday || null,
            affiliation: follower.affiliation || null,
            linked_actor_nconst: follower.linked_actor_nconst || null,
            inviters: follower.inviters || null,
            userScore: follower.userScore || null,
            userVisibility: follower.userVisibility || null,
            sessionToken: follower.sessionToken || null,
            follows_back: follower.follows_back === 1 ? true : false,
            requested: follower.requested === 1 ? true : false,
            online: true,
            userProfilePic: null
        };
        
        return user;
    } catch (error) {
        console.error('Error fetching user profile:', error);
        return {} as User;
    }
};
