import axios from 'axios';
import { Chat } from "../entities/Chat";
import { backend_url } from '../constants/backendURL';
import { User } from '../entities/User';

export const getChatsFromUser = async (user: User): Promise<Chat[]> => {
    try {
        const response = await axios.get(`${backend_url}/chat/get/${user.userID}`);

        const chats: Chat[] = response.data.map((chat: any) => ({
            chatID: chat.chatID,
            name: chat.name,
            description: chat.description,
            profilePic: chat.profilePic || '',
            onlyAdmins: chat.onlyAdmins,
        }));

        return chats;
    } catch (error) {
        console.error('Error fetching chats from user:', error);
        return [];
    }
};
