import styled from 'styled-components';

interface UserActionButtonStyledProps {
    backgroundColor?: string;
    disabled?: boolean;
}

export const UserActionButtonStyled = styled.button<UserActionButtonStyledProps>`
    padding: 5px 10px;
    background-color: ${({ backgroundColor, theme }) => backgroundColor || theme.primaryColor};
    color: ${({ theme }) => theme.backgroundColor};
    border: none;
    border-radius: 5px;
    transition: background-color 0.3s ease;
    margin-left: 60%;

    &:hover {
        cursor: ${({ disabled }) => !disabled ? 'pointer' : ''};
    }
`;
