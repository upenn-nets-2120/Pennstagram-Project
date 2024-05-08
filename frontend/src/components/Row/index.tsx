import React, { useContext } from 'react';
import { RowStyled } from './styled';
import { ThemeContext } from '../../providers/ThemeProvider';

interface RowProps {
    children: React.ReactNode;
}

const Row: React.FC<RowProps> = ({ children }) => {
    const { theme } = useContext(ThemeContext);

    return (
        <RowStyled theme={theme}>
            {children}
        </RowStyled>
    );
};

export default Row;
