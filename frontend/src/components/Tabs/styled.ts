import styled from 'styled-components';

export const TabsStyled = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-around;
    border-bottom: 1px solid ${({ theme }) => theme.lineColor};
    background-color: ${({ theme }) => theme.backgroundColor};
`;
