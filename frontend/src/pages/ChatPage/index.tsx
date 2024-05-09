import { useParams, useNavigate } from "react-router-dom";
import { Column, Main, NavBar, ProfilePic, Row, Scrollable, Page, LinkContainer } from "../../components";
import { useContext, useEffect, useState } from "react";
import { getChatsFromUser } from "../../hooks/get-chats-from-user";
import { getFollowed } from "../../hooks/get-followed";
import defaultProfilePic from '../../assets/defaultProfilePic.png';
import { Chat } from "../../entities/Chat";
import { ThemeContext } from "../../providers/ThemeProvider";
import { ChatTitleContainer } from "./components/ChatTitleContainer";
import { ChatRowContainer } from "./components/ChatRowContainer";
import { Message } from "../../entities/Message";
import { getMessagesFromChat } from "../../hooks/get-messages-from-chat";
import CreateChat from "./components/CreateChat";

const ChatPage: React.FC = () => {
    const { chatID } = useParams();
    const { theme } = useContext(ThemeContext);
    const navigate = useNavigate();
    
    const [chats, setChats] = useState<Chat[]>([]);
    const [messages, setMessages] = useState<Message[]>([]);

    useEffect(() => {
        const init = async () => {
            setChats(await getChatsFromUser((await getFollowed(11))[0]));
        };

        init();
    }, []);
    
    useEffect(() => {
        const init = async () => {
            if (chatID !== undefined) {
                setMessages(await getMessagesFromChat(chatID));
            } else {
                setMessages([]);
            }
        };

        init();
    }, [chatID]);

    const handleCreateChat = () => {
        navigate("/chat/create");
    };

    return (
        <Page>
            <NavBar />
            <Main>
                <Row height='100%'>
                    <Column width='30%'>
                        <Row height='15%' color={theme.primaryColor}>
                            <ChatTitleContainer>
                                <h1>Here are the settings</h1>
                            </ChatTitleContainer>
                        </Row>
                        <Row height='85%'>
                            <Scrollable>
                                {chats.map((chat) => (
                                    <Row height='20%'>
                                        <LinkContainer key={chat.chatID} to={`/chat/${String(chat.chatID)}`}>
                                            <ChatRowContainer theme={theme}>
                                                <ProfilePic src={defaultProfilePic} alt='' />
                                                <div style={{ textDecoration: 'none' }}>{chat.name}</div>
                                            </ChatRowContainer>
                                        </LinkContainer>
                                    </Row>
                                ))}
                            </Scrollable>
                        </Row>
                    </Column>
                    <Column width='70%'>
                        {chatID === "create" ? (
                            <CreateChat />
                        ) : chatID === undefined ? (
                            <button onClick={handleCreateChat}>Create Chat</button>
                        ) : (
                            <>
                                <h1>Display chat information here</h1>
                                <h1>{chatID}</h1>
                                {messages.map((message, index) => (
                                    <div key={index}>
                                        <p>{message.content}</p>
                                    </div>
                                ))}
                            </>
                        )}
                    </Column>
                </Row>
            </Main>
        </Page>
    );
};

export default ChatPage;
