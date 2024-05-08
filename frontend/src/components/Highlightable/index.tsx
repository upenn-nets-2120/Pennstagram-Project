import React, { useContext } from 'react';
import { HighlightableStyled } from './styled'; // Import HighlightableStyled from the appropriate file
import { ThemeContext } from '../../providers/ThemeProvider';

interface HighlightableProps {
    children: React.ReactNode;
}

const Highlightable: React.FC<HighlightableProps> = ({ children }) => {
    const { theme } = useContext(ThemeContext);

    return (
        <HighlightableStyled theme={theme}>
            {children}
        </HighlightableStyled>
    );
};

export default Highlightable;
