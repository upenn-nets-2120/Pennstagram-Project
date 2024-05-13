import axios from 'axios';
import { backend_url } from '../constants/backendURL';
import { User } from '../entities/User';

export const postRemoveFollow = async (user: User, requestedID: string) => {
    try {
        const response = await axios.post(`${backend_url}/friends/removeFriend/${user.userID}/${requestedID}`, {});

        return response.data;
    } catch (error) {
        console.error('Error adding follow:', error);
    }
};
