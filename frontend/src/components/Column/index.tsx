import React, { useContext } from 'react';
import { ColumnStyled } from './styled';
import { ThemeContext } from '../../providers/ThemeProvider';

interface ColumnProps {
    children: React.ReactNode;
    width?: string;
    color?: string;
}

const Column: React.FC<ColumnProps> = ({ children, width, color }) => {
    const { theme } = useContext(ThemeContext);

    return (
        <ColumnStyled theme={theme} width={width} color={color}>
            {children}
        </ColumnStyled>
    );
};

export default Column;
