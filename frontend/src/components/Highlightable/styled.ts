import styled from 'styled-components';

export const HighlightableStyled = styled.div`
    background-color: ${({ theme }) => theme.quaternaryColor};
    border-radius: 2px;
    padding: 10px;
    transition: background-color 0.3s ease;

    &:hover {
        background-color: ${({ theme }) => theme.tertiaryColor};
    }
`;
