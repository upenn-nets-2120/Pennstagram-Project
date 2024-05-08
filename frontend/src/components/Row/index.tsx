import React, { useContext } from 'react';
import { RowStyled } from './styled';
import { ThemeContext } from '../../providers/ThemeProvider';

interface RowProps {
    children: React.ReactNode;
    height?: string;
    color?: string;
}

const Row: React.FC<RowProps> = ({ children, height, color }) => {
    const { theme } = useContext(ThemeContext);

    return (
        <RowStyled theme={theme} height={height} color={color}>
            {children}
        </RowStyled>
    );
};

export default Row;
