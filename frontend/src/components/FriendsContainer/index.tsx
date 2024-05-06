import { useState } from 'react';
import FriendsRows from '../FriendsRows';
import './styles.css';
import FriendsTabs from '../FriendsTabs';
import { FriendTabOption } from '../../entities/FriendTabOption';

const FriendsContainer: React.FC = () => {
    const [tab, setTab] = useState<FriendTabOption>('Following');

    return (
        <div className='friendsContainerContainer'>
            <FriendsTabs setTab={(newTab: FriendTabOption) => setTab(newTab)} active={tab} />
            <FriendsRows tab={tab} />
        </div>
    )
};
  
  export default FriendsContainer;