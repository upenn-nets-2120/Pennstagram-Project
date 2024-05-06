import { useEffect, useState } from 'react';
import './styles.css';
import { User } from '../../entities/User';
import { getFriends } from '../../hooks/get-friends';
import FriendsRow from '../FriendsRow';

interface FriendsRowsProps {
    tab: string;
}
  
const FriendsRows: React.FC<FriendsRowsProps> = ({ tab }) => {
    const [friends, setFriends] = useState<User[]>([]);

    useEffect(() => {
        const runner = async () => {
            setFriends(await getFriends(11));
        }

        runner();
    }, []);

    return (
        <div className='friendsRowsContainer'>
            {friends.map((friend, index) => (
                <FriendsRow key={index} user={friend} />
            ))}
        </div>
    )
};
  
  export default FriendsRows;