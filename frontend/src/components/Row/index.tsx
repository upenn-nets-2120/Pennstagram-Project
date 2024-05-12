import React, { useContext } from 'react';
import { RowStyled } from './styled';
import { ThemeContext } from '../../providers/ThemeProvider';

interface RowProps {
    children: React.ReactNode;
    height?: string;
    color?: string;
    justifyContent?: 'flex-start' | 'flex-end';
}

const Row: React.FC<RowProps> = ({ children, height, color, justifyContent }) => {
    const { theme } = useContext(ThemeContext);

    return (
        <RowStyled theme={theme} height={height} color={color} justifyContent={justifyContent}>
            {children}
        </RowStyled>
    );
};

export default Row;
