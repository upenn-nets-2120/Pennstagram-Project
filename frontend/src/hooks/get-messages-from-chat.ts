import axios from 'axios';
import { Message } from '../entities/Message';
import { User } from '../entities/User';
import { backend_url } from '../constants/backendURL';

export const getMessagesFromChat = async (chatID: string): Promise<Message[]> => {
    try {
        const response = await axios.get(`${backend_url}/chat/${chatID}`);
        const messages: Message[] = response.data.map((messageData: any) => {
            const user: User = {
                userID: messageData.userID,
                username: messageData.username,
                firstName: messageData.firstName || '',
                lastName: messageData.lastName || '',
                profilePic: messageData.userProfilePic || '',
                relationship: 'Following',
            };

            return {
                messageID: messageData.messageID,
                user: user,
                chatID: messageData.chatID,
                timestamp: new Date(messageData.timestamp),
                content: messageData.content,
            };
        });

        return messages;
    } catch (error) {
        console.error('Error fetching messages:', error);
        return [];
    }
};
