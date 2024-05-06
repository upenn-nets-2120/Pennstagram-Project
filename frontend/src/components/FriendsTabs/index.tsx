import './styles.css';
import FriendsTab from '../FriendsTab';
import { FriendTabOption } from '../../entities/FriendTabOption';

interface FriendsTabsProps {
    setTab: (newTab: FriendTabOption) => void;
    active: FriendTabOption;
}
  
const FriendsTabs: React.FC<FriendsTabsProps> = ({ setTab, active }) => {
    return (
        <div className='friendsTabsContainer'>
            <FriendsTab title='Following' active={active} setTab={setTab} />
            <FriendsTab title='Followed By' active={active} setTab={setTab} />
            <FriendsTab title='Recommended' active={active} setTab={setTab} />
        </div>
    )
};
  
export default FriendsTabs;