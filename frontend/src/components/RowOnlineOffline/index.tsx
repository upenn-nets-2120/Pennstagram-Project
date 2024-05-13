import React from 'react';
import { RowOnlineOfflineStyled } from './styled';

interface RowNameProps {
    children: React.ReactNode;
}

const RowOnlineOffline: React.FC<RowNameProps> = ({ children }) => {
    return (
        <RowOnlineOfflineStyled>
            {children}
        </RowOnlineOfflineStyled>
    )
};

export default RowOnlineOffline;
