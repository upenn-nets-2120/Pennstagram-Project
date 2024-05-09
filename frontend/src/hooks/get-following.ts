import axios from 'axios';
import { User } from "../entities/User";
import { backend_url } from '../constants/backendURL';

export const getFollowing = async (userID: number): Promise<User[]> => {
    try {
        const response = await axios.get(`${backend_url}friends/followeds/${userID}`);
        const users: User[] = response.data.map((follower: any) => ({
            userID: follower.userID,
            username: follower.username,
            firstName: follower.firstName || '',
            lastName: follower.lastName || '',
            profilePic: follower.userProfilePic || '',
            relationship: 'Following',
        }));
        return users;
    } catch (error) {
        console.error('Error fetching followed users:', error);
        return [];
    }
};
