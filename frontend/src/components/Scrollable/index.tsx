import React from 'react';
import { ScrollableStyled } from './styled';

interface ScrollableProps {
    children: React.ReactNode;
}

const Scrollable: React.FC<ScrollableProps> = ({ children }) => {
    return (
        <ScrollableStyled>
            {children}
        </ScrollableStyled>
    );
};

export default Scrollable;
