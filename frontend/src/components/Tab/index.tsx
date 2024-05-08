import React, { useContext } from 'react';
import { TabStyled } from './styled';
import { FriendTabOption } from '../../entities/FriendTabOption';
import { ThemeContext } from '../../providers/ThemeProvider';

interface TabProps {
    title: FriendTabOption;
    activeTab: FriendTabOption;
    setTab: (newTab: FriendTabOption) => void;
}

const Tab: React.FC<TabProps> = ({ title, activeTab, setTab }) => {
    const { theme } = useContext(ThemeContext);

    return (
        <TabStyled active={activeTab === title} theme={theme} onClick={() => setTab(title)}>
            <h2>{title}</h2>
        </TabStyled>
    );
};

export default Tab;
