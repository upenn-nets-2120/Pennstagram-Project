import styled from 'styled-components';

export const UserActionButtonStyled = styled.button`
    padding: 5px 10px;
    background-color: ${({ theme }) => theme.primaryColor};
    color: ${({ theme }) => theme.backgroundColor};
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
    margin-left: 60%;

    &:hover {
        background-color: ${({ theme }) => theme.secondaryColor};
    }
`;
