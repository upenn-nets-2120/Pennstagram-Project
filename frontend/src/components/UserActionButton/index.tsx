import React, { useContext } from 'react';
import { UserActionButtonStyled } from './styled';
import { ThemeContext } from '../../providers/ThemeProvider';

interface UserActionButtonProps {
    onClick: (actionType: string) => void;
    actionType: 'Request' | 'Following' | 'Follow' | 'Requested' | 'Accept' | 'Reject';
}

const UserActionButton: React.FC<UserActionButtonProps> = ({ onClick, actionType }) => {
    const { theme } = useContext(ThemeContext);

    const isDisabled = () => actionType === 'Following' || actionType === 'Requested';

    const getBackgroundColor = () => {
        switch (actionType) {
            case 'Request':
                return theme.primaryColor;
            case 'Following':
                return theme.tertiaryColor;
            case 'Follow':
                return theme.primaryColor;
            case 'Requested':
                return theme.tertiaryColor;
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
            onClick={() => onClick(actionType)}
            theme={theme}
            backgroundColor={getBackgroundColor()}
            disabled={isDisabled()}
        >
            {actionType}
        </UserActionButtonStyled>
    );
};

export default UserActionButton;
