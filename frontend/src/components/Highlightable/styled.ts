import styled from 'styled-components';

export const HighlightableStyled = styled.div`
    height: 100%;
    width: 100%;
    background-color: ${({ theme }) => theme.quaternaryColor};
    transition: background-color 0.3s ease;

    &:hover {
        background-color: ${({ theme }) => theme.tertiaryColor};
    }
`;
