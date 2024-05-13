import React, { useState, useEffect, useContext } from 'react';
import { Column, Main, NavBar, ProfilePic, Row, Scrollable, Page, LinkContainer } from '../../components';
import { ThemeContext } from '../../providers/ThemeProvider';
import { getChatsFromUser } from '../../hooks/get-chats-from-user';
import { getFollowed } from '../../hooks/get-followed';
import { UserContext } from '../../providers/UserProvider';
import { Notification } from '../../entities/Notification';
import { getNotificationsFromUser } from '../../hooks/get-notifications-from-user';
import Border from '../../components/Border';

const NotificationsPage: React.FC = () => {
    const { user } = useContext(UserContext);
    const { theme } = useContext(ThemeContext);

    const [notifications, setNotifications] = useState<Notification[]>([]);

    useEffect(() => {
        const init = async () => {
            setNotifications(await getNotificationsFromUser(user));
        };

        init();
    }, []);

    return (
        <Page>
            <NavBar />
            <Main>
                <Column width='100%'>
                    <Border sides='top'>
                        <Scrollable>
                            {notifications.map((notification) => (
                                <Row height="9%" key={notification.notificationID} color={theme.quaternaryColor}>
                                    <Border sides='bottom'>
                                        
                                        <h5>{notification.content}</h5>
                                    </Border>
                                </Row>
                            ))}
                        </Scrollable>
                    </Border>
                </Column>
            </Main>
        </Page>
    );
};

export default NotificationsPage;
