import axios from 'axios';
import { backend_url } from '../constants/backendURL';
import { User } from '../entities/User';

export const postCreateChat = async (
    user: User,
    chatName: string,
    description: string,
    profilePic: string,
    onlyAdmins: boolean,
    users: number[]
) => {
    try {
        const response = await axios.post(`${backend_url}/chat/create/${user.userID}`, {
            chatName,
            description,
            profilePic,
            onlyAdmins,
            users
        });
        return response.data;
    } catch (error) {
        console.error('Error creating chat:', error);
    }
};
