import React from 'react';
import { ProfilePicStyled } from './styled';

const ProfilePic: React.FC<React.ImgHTMLAttributes<HTMLImageElement>> = ({ ...imgProps }) => {
    return (
        <ProfilePicStyled {...imgProps} />
    );
};
  
export default ProfilePic;
