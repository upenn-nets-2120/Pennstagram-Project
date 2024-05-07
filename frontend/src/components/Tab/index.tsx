import React from 'react';
import { TabStyled } from './styled';
import { FriendTabOption } from '../../entities/FriendTabOption';

interface TabProps {
    title: FriendTabOption;
    activeTab: FriendTabOption;
    setTab: (newTab: FriendTabOption) => void;
}

const Tab: React.FC<TabProps> = ({ title, activeTab, setTab }) => {
    return (
        <TabStyled active={activeTab === title} onClick={() => setTab(title)}>
            <h2>{title}</h2>
        </TabStyled>
    );
};

export default Tab;
