import { FriendTabOption } from '../../entities/FriendTabOption';
import './styles.css';

interface FriendsTabsProps {
    title: FriendTabOption;
    active: FriendTabOption;
    setTab: (newTab: FriendTabOption) => void;
}
  
const FriendsTabs: React.FC<FriendsTabsProps> = ({ title, active, setTab }) => {
    return (
        <div className={`friendsTabContainer ${active === title ? 'activeFriendsTabContainer' : ''}`} onClick={() => setTab(title)}>
            <h2>{title}</h2>
        </div>
    )
};
  
export default FriendsTabs;