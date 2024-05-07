import React from 'react';
import { TabsStyled } from './styled';

interface TabsProps {
    children: React.ReactNode;
}

const Tabs: React.FC<TabsProps> = ({ children }) => {
    return (
        <TabsStyled>
            {children}
        </TabsStyled>
    );
};

export default Tabs;
