import React, { useContext } from 'react';
import { UserActionButtonStyled } from './styled';
import { ThemeContext } from '../../providers/ThemeProvider';

interface UserActionButtonProps {
    onClick: () => void;
    children: React.ReactNode;
}

const UserActionButton: React.FC<UserActionButtonProps> = ({ onClick, children }) => {
    const { theme } = useContext(ThemeContext);

    return (
        <UserActionButtonStyled onClick={onClick} theme={theme}>
            {children}
        </UserActionButtonStyled>
    );
};

export default UserActionButton;
