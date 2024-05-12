import axios from 'axios';
import { backend_url } from '../constants/backendURL';
import { User } from '../entities/User';

export const postAcceptRequest = async (user: User, requestedID: string) => {
    try {
        const response = await axios.post(`${backend_url}/friends/acceptRequest/${user.userID}/${requestedID}`, {});

        return response.data;
    } catch (error) {
        console.error('Error adding follow:', error);
        throw new Error('Failed to add follow');
    }
};
