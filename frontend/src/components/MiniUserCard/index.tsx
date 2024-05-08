import React from 'react';
import MiniUserCardStyled from './styled';

interface MiniUserCardProps {
    children: React.ReactNode;
    to: string;
}

const MiniUserCard: React.FC<MiniUserCardProps> = ({ children, to }) => {
    return (
        <MiniUserCardStyled to={to}>
            {children}
        </MiniUserCardStyled>
    );
};

export default MiniUserCard;
