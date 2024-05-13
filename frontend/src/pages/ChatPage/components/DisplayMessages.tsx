import React, { useContext, useState } from 'react';
import { Message } from '../../../entities/Message';
import { Chat } from '../../../entities/Chat';
import { Column, ProfilePic, Row, Scrollable } from '../../../components';
import { ChatHeaderContainer } from './ChatHeaderContainer';
import { ThemeContext } from '../../../providers/ThemeProvider';
import { UserContext } from '../../../providers/UserProvider';
import { MessageContainer } from './Message';

interface DisplayMessagesProps {
    messages: Message[];
    chat: Chat | undefined;
    sendMessage: (message: string) => void;
}

const DisplayMessages: React.FC<DisplayMessagesProps> = ({ messages, chat, sendMessage }) => {
    const [newMessage, setNewMessage] = useState<string>('');
    const { theme } = useContext(ThemeContext);
    const { user } = useContext(UserContext);

    if (!chat) {
        return <></>;
    }

    const handleSendMessage = () => {
        sendMessage(newMessage);
        setNewMessage('');
    };

    const pp = 'https://scontent-iad3-1.cdninstagram.com/v/t51.2885-19/430630673_1112674653082684_355899691501681442_n.jpg?stp=dst-jpg_s100x100&_nc_cat=110&ccb=1-7&_nc_sid=3fd06f&_nc_ohc=m1KW2AFVtTkQ7kNvgEsLgmN&_nc_oc=AdiKDTWmHGiqe1TwvT-Cap7ytLH3YSnp8cm4DNMy6h5YttwhbmV1CVIGr65GOXzUjlFniAnV9BQLcwIxj28WJ0bF&_nc_ad=z-m&_nc_cid=0&_nc_ht=scontent-iad3-1.cdninstagram.com&oh=00_AfAzx4QYRLjn4LTeZOHy2tRKuUB_TG07vSFlg8lANNooeA&oe=66416534';

    console.log(chat);

    return (
        <Column>
            <Row height="15%" color={theme.backgroundColor}>
                <ChatHeaderContainer>
                    <ProfilePic src={pp} alt="Chat Pic" style={{ width: '50px', height: '50px', borderRadius: '50%', marginRight: '10px' }} />
                    <h1>{chat.name}</h1>
                </ChatHeaderContainer>
            </Row>
            <Row height="75%" color={theme.backgroundColor}>
                <Scrollable>
                    {messages.map((message, index) => (
                        <Row key={index} height='auto' justifyContent={message.user.userID === user?.userID ? 'flex-end' : 'flex-start'}>
                            {message.user.userID !== user?.userID &&
                                <Column width='7.5%'>
                                    <Row height='7vh'>
                                        <ProfilePic src={pp} alt='' />
                                    </Row>
                                </Column>
                            }
                            <Column width='auto'>
                                <MessageContainer color={message.user.userID === user?.userID ? theme.secondaryColor : theme.tertiaryColor} textColor={message.user.userID === user?.userID ? 'white' : 'black'}>
                                    {message.content}
                                </MessageContainer>
                            </Column>
                            {message.user.userID === user?.userID &&
                                <Column width='7.5%'>
                                    <Row height='7vh'>
                                        <ProfilePic src={pp} alt='' />
                                    </Row>
                                </Column>
                            }
                        </Row>
                    ))}
                </Scrollable>
            </Row>
            <Row height='10%' color={theme.tertiaryColor}>
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            handleSendMessage();
                        }
                    }}
                    placeholder="Type your message..."
                    style={{ marginLeft: '10px', padding: '5px', borderRadius: '10px', height: '70%', width: '90%' }}
                />
                <button onClick={handleSendMessage} style={{ padding: '5px 10px', marginRight: '20px' }}>Send</button>
            </Row>
        </Column>
    );
};

export default DisplayMessages;
