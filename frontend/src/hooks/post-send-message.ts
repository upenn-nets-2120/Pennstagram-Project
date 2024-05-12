import axios from 'axios';
import { backend_url } from '../constants/backendURL';
import { User } from '../entities/User';

export const postSendMessage = async (user: User, chatID: string, content: string): Promise<boolean> => {
    try {
        await axios.post(`${backend_url}/chat/send-message/${user.userID}`, {
            chatID,
            content,
        });

        return true;
    } catch (error) {
        console.error('Error posting message:', error);
        return false;
    }
};
