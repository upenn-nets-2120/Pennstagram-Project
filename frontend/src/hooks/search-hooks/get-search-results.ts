import axios from 'axios';
import { backend_url } from '../../constants/backendURL';
import { User } from '../../entities/User';
import { Response } from '../../entities/Response';

export const getSearchResults = async (user: User, context: string, query: string): Promise<Response> => {
    let response;
    try {
        response = await axios.post(`${backend_url}/search/getSearchResults`, {
            username: user.username,
            context,
            query,
        });

        return {
            data: response.data.data,
            message: response.data.message
        };
    } catch (error) {
        console.error('Error posting message:', error);
        return {
            data: "error",
            message: "error"
        };
    }
};
