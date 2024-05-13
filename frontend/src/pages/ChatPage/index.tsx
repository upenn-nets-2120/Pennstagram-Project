import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Column, Main, NavBar, ProfilePic, Row, Scrollable, Page, LinkContainer } from '../../components';
import { ThemeContext } from '../../providers/ThemeProvider';
import { ChatTitleContainer } from './components/ChatTitleContainer';
import { ChatRowContainer } from './components/ChatRowContainer';
import { Message } from '../../entities/Message';
import { getChatsFromUser } from '../../hooks/get-chats-from-user';
import { getFollowed } from '../../hooks/get-followed';
import { getMessagesFromChat } from '../../hooks/get-messages-from-chat';
import defaultProfilePic from '../../assets/defaultProfilePic.png';
import CreateChat from './components/CreateChat';
import { Chat } from '../../entities/Chat';
import { postSendMessage } from '../../hooks/post-send-message';
import { UserContext } from '../../providers/UserProvider';
import DisplayMessages from './components/DisplayMessages';
import findChatById from '../../utils/chatsToChat';

const ChatPage: React.FC = () => {
    const { chatID } = useParams();
    const { theme } = useContext(ThemeContext);
    const { user } = useContext(UserContext);
    const navigate = useNavigate();

    const [chats, setChats] = useState<Chat[]>([]);
    const [chat, setChat] = useState<Chat | undefined>(undefined);
    const [messages, setMessages] = useState<Message[]>([]);

    useEffect(() => {
        const init = async () => {
            setChats(await getChatsFromUser((await getFollowed(user.userID))[0]));
        };
        init();
    }, []);

    useEffect(() => {
        const init = async () => {
            if (chatID !== undefined && chatID !== 'create') {
                setMessages(await getMessagesFromChat(chatID));
            } else {
                setMessages([]);
            }
        };

        init();
    }, [chatID]);
    
    useEffect(() => {
        setChat(findChatById(chats, chatID));
    }, [chats, chatID]);

    const handleCreateChat = () => {
        navigate('/chat/create');
    };

    const handleSendMessage = async (content: string) => {
        if (!content.trim()) return;
        if (chatID !== undefined && chatID !== 'create') {
            await postSendMessage(user, chatID, content); // Convert chatID to string
            setMessages(await getMessagesFromChat(chatID.toString())); // Convert chatID to string
        } else {
            setMessages([]);
        }
    };
    

    return (
        <Page>
            <NavBar />
            <Main>
                <Row height="100%">
                    <Column width="30%">
                        <Row height="15%" color={theme.primaryColor}>
                            <h1 style={{ color: 'white', fontSize: '4vw', marginBottom: '2vh' }}>Chats</h1>
                            <button onClick={handleCreateChat} style={{ marginBottom: '2vh' }}>Create Chat</button>
                        </Row>
                        <Row height="85%">
                            <Scrollable>
                                {chats.map((chat) => (
                                    <Row height="20%" key={chat.chatID}>
                                        <LinkContainer to={`/chat/${chat.chatID}`}>
                                            <ChatRowContainer theme={theme}>
                                                <ProfilePic src={defaultProfilePic} alt="" />
                                                <div style={{ textDecoration: 'none' }}>{chat.name}</div>
                                            </ChatRowContainer>
                                        </LinkContainer>
                                    </Row>
                                ))}
                            </Scrollable>
                        </Row>
                    </Column>
                    <Column width="70%">
                        {chatID === 'create' ? (
                            <CreateChat />
                        ) : chatID === undefined ? (
                            <button onClick={handleCreateChat}>Create Chat</button>
                        ) : (
                            <DisplayMessages messages={messages} chat={chat} sendMessage={handleSendMessage} />
                        )}
                    </Column>
                </Row>
            </Main>
        </Page>
    );
};

export default ChatPage;
