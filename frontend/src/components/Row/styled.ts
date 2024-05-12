import styled from 'styled-components';

interface RowStyledProps {
    height?: string;
    color?: string;
    justifyContent?: 'flex-start' | 'flex-end';
}

export const RowStyled = styled.div<RowStyledProps>`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: ${({ justifyContent }) => justifyContent || 'space-between'};
    height: ${({ height }) => height || '100%'};
    width: 100%;
    background-color: ${({ color }) => color || 'transparent'};
    box-sizing: border-box;
`;
