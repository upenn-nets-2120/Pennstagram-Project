import { useEffect, useState } from 'react';
import './styles.css';
import { User } from '../../entities/User';
import { getFollowed } from '../../hooks/get-followed';
import { getFollowing } from '../../hooks/get-following';
import { getRecommended } from '../../hooks/get-recommended';
import FriendsRow from '../FriendsRow';

interface FriendsRowsProps {
    tab: string;
}
  
const FriendsRows: React.FC<FriendsRowsProps> = ({ tab }) => {
    const [following, setFollowing] = useState<User[]>([]);
    const [followed, setFollowed] = useState<User[]>([]);
    const [recommended, setRecommended] = useState<User[]>([]);

    useEffect(() => {
        const init = async () => {
            setFollowing(await getFollowing(11));
            setFollowed(await getFollowed(11));
            setRecommended(await getRecommended(11));
        }

        init();
    }, []);

    return (
        <div className='friendsRowsContainer'>
            {tab === 'Followed By' && (
                followed.map((user, index) => (
                    <FriendsRow key={index} user={user} />
                ))
            )}
            {tab === 'Following' && (
                following.map((user, index) => (
                    <FriendsRow key={index} user={user} />
                ))
            )}
            {tab === 'Recommended' && (
                recommended.map((user, index) => (
                    <FriendsRow key={index} user={user} />
                ))
            )}
        </div>
    )
};
  
export default FriendsRows;
