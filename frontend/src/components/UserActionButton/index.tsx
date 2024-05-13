import React, { useContext } from 'react';
import { UserActionButtonStyled } from './styled';
import { ThemeContext } from '../../providers/ThemeProvider';

interface UserActionButtonProps {
    onClick: (actionType: string) => void;
    actionType: 'Request' | 'Unfollow' | 'Follow' | 'Remove Request' | 'Accept' | 'Reject';
}

const UserActionButton: React.FC<UserActionButtonProps> = ({ onClick, actionType }) => {
    const { theme } = useContext(ThemeContext);

    const getBackgroundColor = () => {
        switch (actionType) {
            case 'Request':
                return theme.primaryColor;
            case 'Unfollow':
                return 'red';
            case 'Follow':
                return theme.primaryColor;
            case 'Remove Request':
                return 'red';
            case 'Accept':
                return theme.primaryColor;
            case 'Reject':
                return 'red';
            default:
                return theme.primaryColor;
        }
    };

    return (
        <UserActionButtonStyled
            onClick={() => onClick(actionType)} theme={theme} background_color={getBackgroundColor()}>
            {actionType}
        </UserActionButtonStyled>
    );
};

export default UserActionButton;
