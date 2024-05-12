import styled from 'styled-components';

interface TabStyledProps {
    active: boolean;
}

export const TabStyled = styled.div<TabStyledProps>`
    height: 100%;
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    border-bottom: 3px solid transparent;
    cursor: pointer;
    transition: all 0.3s ease;
    padding: 10px;
    ${({ active, theme }) => active && `
        background-color: ${theme.quaternaryColor};
        border-color: ${theme.primaryColor};
    `}
    &:hover {
        background-color: ${({ theme }) => theme.quaternaryColor};
    }
    &:active {
        background-color: ${({ theme }) => theme.tertiaryColor};
    }
`;
