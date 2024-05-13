import axios from 'axios';
import { backend_url } from '../constants/backendURL';
import { User } from '../entities/User';

export const postRemoveRequest = async (user: User, requestedID: string) => {
    try {
        const response = await axios.post(`${backend_url}/friends/removeRequest/${user.userID}/${requestedID}`, {});

        return response.data;
    } catch (error) {
        console.error('Error adding request:', error);
    }
};
