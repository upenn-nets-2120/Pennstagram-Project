import styled from 'styled-components';

export const ChatRowContainer = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    padding: 10px;
    border-bottom: 1px solid #ccc;
    transition: background-color 0.3s ease;
    background-color: ${({ theme }) => theme.quaternaryColor};
    box-sizing: border-box;
    cursor: pointer;

    &:hover {
        background-color: ${({ theme }) => theme.tertiaryColor};
    }
`;
