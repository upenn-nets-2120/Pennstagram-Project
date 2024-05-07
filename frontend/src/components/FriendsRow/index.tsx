import React from 'react';
import './styles.css';
import { User } from '../../entities/User';
import defaultProfilePic from '../../assets/defaultProfilePic.png'

interface FriendsRowProps {
    user: User;
}

const FriendsRow: React.FC<FriendsRowProps> = ({ user }) => {
  return (
    <div className='friendsRowContainer'>
        <img src={defaultProfilePic} alt='' />
        <h2 className='friendRowName'>{`${user.firstName} ${user.lastName}`}</h2>
        <h3>{user.relationship}</h3>
    </div>
  );
};
  
export default FriendsRow;
