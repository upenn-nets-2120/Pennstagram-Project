import React, { useContext } from 'react';
import { ColumnStyled } from './styled';
import { ThemeContext } from '../../providers/ThemeProvider';

interface ColumnProps {
    children: React.ReactNode;
    width?: string;
}

const Column: React.FC<ColumnProps> = ({ children, width }) => {
    const { theme } = useContext(ThemeContext);

    return (
        <ColumnStyled theme={theme} width={width}>
            {children}
        </ColumnStyled>
    );
};

export default Column;
