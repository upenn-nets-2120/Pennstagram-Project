import axios from 'axios';
import { backend_url } from '../constants/backendURL';
import { User } from '../entities/User';
import { Notification } from '../entities/Notification';

export const getNotificationsFromUser = async (user: User): Promise<Notification[]> => {
    try {
        const response = await axios.get(`${backend_url}/notification/notifications/get/${user.userID}`);

        const chats: Notification[] = response.data.map((notification: any) => ({
            notificationID: notification.notificationID,
            content: notification.content,
        }));

        return chats;
    } catch (error) {
        console.error('Error fetching chats from user:', error);
        return [];
    }
};
