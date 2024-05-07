import { useEffect, useState } from "react";
import { FriendTabOption } from "../../entities/FriendTabOption";
import { User } from "../../entities/User";
import { Content, Main, Row, Rows, Tab, Tabs, ProfilePic } from '../../components';
import { getFollowing } from "../../hooks/get-following";
import { getFollowed } from "../../hooks/get-followed";
import { getRecommended } from "../../hooks/get-recommended";
import defaultProfilePic from '../../assets/defaultProfilePic.png';

const FriendsPage: React.FC = () => {
    const [tab, setTab] = useState<FriendTabOption>('Following');
    const [following, setFollowing] = useState<User[]>([]);
    const [followed, setFollowed] = useState<User[]>([]);
    const [recommended, setRecommended] = useState<User[]>([]);

    useEffect(() => {
        const init = async () => {
            setFollowing(await getFollowing(11));
            setFollowed(await getFollowed(11));
            setRecommended(await getRecommended(11));
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
        default:
            displayedUsers = [];
            break;
    }

    return (
        <Main>
            <Content width='60%'>
                <Tabs>
                    <Tab title='Following' activeTab={tab} setTab={setTab} />
                    <Tab title='Followed By' activeTab={tab} setTab={setTab} />
                    <Tab title='Recommended' activeTab={tab} setTab={setTab} />
                </Tabs>
                <Rows>
                    {displayedUsers.map((user, index) => (
                        <Row key={index}>
                            <ProfilePic  src={defaultProfilePic} alt='' />



                            {/* <RowName>{`${user.firstName} ${user.lastName}`}</RowName>
                            <h3>{user.relationship}</h3> */}
                        </Row>
                    ))}
                </Rows>
            </Content>
        </Main>
    )
};

export default FriendsPage;