/*import { useState, useEffect } from 'react';
import axios from 'axios';

//fetch posts for a user
export const usePosts = (username) => {
    const [error, setError] = useState(null); //initially set to null, update using setError
    const [posts, setPosts] = useState([]); //initially empty array (maintains list of posts), update using setPosts
    const [isLoading, setIsLoading] = useState(false);//check if component is loading the posts, update using setIsLoading

    useEffect(() => {
        const fetchPosts = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get(`/${username}/getPostsFeed`); //send GET request to server w username paramtere
                setPosts(response.data); //update posts state with the fetched data
            } catch (error) {
                setError(error); //if error, update setError
            }
            setIsLoading(false);
        };
        fetchPosts();
    }, [username]);

    return { posts, error, isLoading };
};
*/