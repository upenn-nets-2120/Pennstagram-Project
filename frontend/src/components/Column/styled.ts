import styled from 'styled-components';

interface ColumnStyledProps {
    width?: string;
    color?: string;
}

export const ColumnStyled = styled.div<ColumnStyledProps>`
    display: flex;
    flex-direction: column;
    align-items: flex-start; /* Align items at the top */
    justify-content: flex-start; /* Align content at the start */
    width: ${({ width }) => width || '100%'};
    height: 100%;
    box-sizing: border-box;
    background-color: ${({ color }) => color || 'transparent'};
`;
