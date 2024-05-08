import React, { useContext } from 'react';
import { ThemeContext } from '../../providers/ThemeProvider';
import { TabsStyled } from './styled';

interface TabsProps {
    children: React.ReactNode;
}

const Tabs: React.FC<TabsProps> = ({ children }) => {
    const { theme } = useContext(ThemeContext);

    return (
        <TabsStyled theme={theme}>
            {children}
        </TabsStyled>
    );
};

export default Tabs;
