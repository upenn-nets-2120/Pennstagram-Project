import styled from 'styled-components';

interface MessageContainerProps {
    color: string;
    textColor: string;
}

export const MessageContainer = styled.div<MessageContainerProps>`
    background-color: ${({ color }) => color};
    color: ${({ textColor }) => textColor};
    border-radius: 10px;
    padding: 10px;
    margin: 5px;
    max-width: 70%;
    display: flex;
    align-items: center;
    word-wrap: break-word;
`;
