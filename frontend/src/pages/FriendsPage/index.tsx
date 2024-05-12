import { useContext, useEffect, useState } from "react";
import { FriendTabOption } from "../../entities/FriendTabOption";
import { User } from "../../entities/User";
import { Main, Row, Tab, ProfilePic, NavBar, RowName, UserActionButton, Page, Column, Scrollable } from '../../components';
import { getFollowing } from "../../hooks/get-following";
import { getFollowed } from "../../hooks/get-followed";
import { getRecommended } from "../../hooks/get-recommended";
import defaultProfilePic from '../../assets/defaultProfilePic.png';
import MiniUserCard from "../../components/MiniUserCard";
import Border from "../../components/Border";
import { ThemeContext } from "../../providers/ThemeProvider";
import { getUserActionType } from "../../utils/getActionFromUser";
import { UserContext } from "../../providers/UserProvider";
import { postAddRequest } from "../../hooks/post-add-request";
import { postAddFollow } from "../../hooks/post-add-follow";
import { getRequests } from "../../hooks/get-requests";
import { postAcceptRequest } from "../../hooks/post-accept-request";
import { postRejectRequest } from "../../hooks/post-reject-request";

const FriendsPage: React.FC = () => {
    const [tab, setTab] = useState<FriendTabOption>('Following');
    const [following, setFollowing] = useState<User[]>([]);
    const [followed, setFollowed] = useState<User[]>([]);
    const [recommended, setRecommended] = useState<User[]>([]);
    const [requests, setRequests] = useState<User[]>([]);

    const { theme } = useContext(ThemeContext);
    const { user } = useContext(UserContext);

    useEffect(() => {
        const init = async () => {
            setFollowing(await getFollowing(user.userID));
            setFollowed(await getFollowed(user.userID));
            setRecommended(await getRecommended(user.userID));
            setRequests(await getRequests(user.userID));
        };

        init();
    }, []);

    let displayedUsers: User[] = [];
    switch (tab) {
        case 'Followed By':
            displayedUsers = followed;
            break;
        case 'Following':
            displayedUsers = following;
            break;
        case 'Recommended':
            displayedUsers = recommended;
            break;
        case 'Requests':
            displayedUsers = requests;
            break;
        default:
            displayedUsers = [];
            break;
    }

    const handleAction = (actionType: string, userID: number) => {
        switch (actionType) {
            case 'Follow':
                postAddFollow(user, userID.toString());
                break;
            case 'Following':
                break;
            case 'Requested':
                break;
            case 'Request':
                postAddRequest(user, userID.toString());
                break;
            case 'Accept':
                postAcceptRequest(user, userID.toString());
                break;
            case 'Reject':
                postRejectRequest(user, userID.toString());
                break;
            default:
                break;
        }
    };

    return (
        <Page>
            <NavBar />
            <Main>
                <Column width='100%'>
                    <Row height='20%'>
                        <Column width="100%">
                            <Row height='100%'>
                                <Tab title='Following' activeTab={tab} setTab={setTab} />
                                <Tab title='Followed By' activeTab={tab} setTab={setTab} />
                                <Tab title='Recommended' activeTab={tab} setTab={setTab} />
                                <Tab title='Requests' activeTab={tab} setTab={setTab} />
                            </Row>
                        </Column>
                    </Row>
                    <Row height="80%">
                        <Scrollable>
                        {displayedUsers.map((user, index) => (
                            <Row key={index} height='20%' color={theme.quaternaryColor}>
                                <Border sides="bottom" color={'gray'}>
                                    <Row height='100%'>
                                        <MiniUserCard to={`/user/${user.userID}`}>
                                            <ProfilePic src={defaultProfilePic} alt='' />
                                            <RowName>{user.username}</RowName>
                                        </MiniUserCard>
                                        {tab === 'Requests'
                                            ?
                                                <Column width="5%">
                                                    <Row height="100%">
                                                        
                                                        <UserActionButton onClick={(actionType: string) => handleAction(actionType, user.userID)} actionType={'Accept'} />
                                                        <UserActionButton onClick={(actionType: string) => handleAction(actionType, user.userID)} actionType={'Reject'} />
                                                    </Row>
                                                </Column>
                                            :
                                                <UserActionButton onClick={(actionType: string) => handleAction(actionType, user.userID)} actionType={getUserActionType(user)} />
                                        }
                                    </Row>
                                </Border>
                            </Row>
                        ))}
                        </Scrollable>
                    </Row>
                </Column>
            </Main>
        </Page>
    );
};

export default FriendsPage;
