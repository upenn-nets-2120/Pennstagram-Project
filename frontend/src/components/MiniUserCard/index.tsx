import React, { useContext } from 'react';
import MiniUserCardStyled from './styled';
import { ThemeContext } from "../../providers/ThemeProvider";

interface MiniUserCardProps {
    children: React.ReactNode;
    to: string;
}

const MiniUserCard: React.FC<MiniUserCardProps> = ({ children, to }) => {
    const { theme } = useContext(ThemeContext);

    return (
        <MiniUserCardStyled to={to} theme={theme}>
            {children}
        </MiniUserCardStyled>
    );
};

export default MiniUserCard;
