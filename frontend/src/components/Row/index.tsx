import React from 'react';
import { RowStyled } from './styled';

interface RowProps {
    children: React.ReactNode;
}

const Row: React.FC<RowProps> = ({ children }) => {
    return (
        <RowStyled>
            {children}
        </RowStyled>
    );
};

export default Row;
