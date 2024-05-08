import React from 'react';
import { RowNameStyled } from './styled';

interface RowNameProps {
    children: React.ReactNode;
}

const RowName: React.FC<RowNameProps> = ({ children }) => {
    return (
        <RowNameStyled>
            {children}
        </RowNameStyled>
    )
};

export default RowName;
