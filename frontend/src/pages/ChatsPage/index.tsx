import React, { useEffect, useState } from 'react';
import { Chat } from '../../entities/Chat';
import { Content, Main, Row, Rows, Tab, Tabs, ProfilePic, NavBar } from '../../components';
import defaultProfilePic from '../../assets/defaultProfilePic.png';
import { getChatsFromUser } from '../../hooks/get-chats-from-user';
import { getFollowed } from '../../hooks/get-followed';

const ChatsPage: React.FC = () => {
    const [chats, setChats] = useState<Chat[]>([]);

    useEffect(() => {
        const init = async () => {
            setChats(await getChatsFromUser((await getFollowed(11))[0]));
        };

        init();
    }, []);

    return (
        <Main>
            <NavBar />
            <Content width='50%'>
                <Tabs>
                    <Tab title='Following' activeTab='Following' setTab={() => {}} />
                </Tabs>
                <Rows>
                    {chats.map((chat) => (
                        <Row key={chat.chatID}>
                            <ProfilePic src={defaultProfilePic} alt='' />
                            <div>{chat.name}</div>
                        </Row>
                    ))}
                </Rows>
            </Content>
            <div style={{ width: '50%' }}>
                {/* Space for creating new chat */}
            </div>
        </Main>
    );
};

export default ChatsPage;
