import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Column, Main, NavBar, ProfilePic, Row, Scrollable, Page, LinkContainer } from '../../components';
import { UserContext } from '../../providers/UserProvider';
import { backend_url } from '../../constants/backendURL';
import { User } from "../../entities/User";

const ProfilePage: React.FC = () => {
    const [userProfile, setUserProfile] = useState<User | null>(null);
    const [similarActors, setSimilarActors] = useState<User[]>([]);
    const [showActors, setShowActors] = useState(false);
    const { user } = useContext(UserContext);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data } = await axios.get(`${backend_url}/profile/fetchProfile`, { withCredentials: true } );
                const { userProfile, userHashtags } = data;
                setUserProfile({ ...userProfile, hashtags: userHashtags });
            } catch (error) {
                console.error('Error fetching user profile:', error);
            }
        };
        fetchData();
    }, [user.username]);

    const handleActorSelection = async (actorId: string) => {
        try {
            await axios.put(`${backend_url}/profile/modifyLinkedActor`, { username: user.username, newActorNConst: actorId });
            setShowActors(false);
            // Refresh user profile to reflect linked actor change
            const { data } = await axios.get(`${backend_url}/profile/fetchProfile`, { withCredentials: true } );
            const { userProfile, userHashtags } = data;
            setUserProfile({ ...userProfile, hashtags: userHashtags });
        } catch (error) {
            console.error('Error updating linked actor:', error);
        }
    };

    const toggleShowActors = async () => {
        if (!showActors && similarActors.length === 0) {
            try {
                const { data: nconsts } = await axios.get(`${backend_url}/profile/fetchSimilarActors`, { params: { username: user.username } });
                const actorProfilesPromises = nconsts.map((nconst: string) =>
                    axios.get(`${backend_url}/profile/fetchProfileByNConst`, { params: { nconst } })
                );
                const actorProfilesResponses = await Promise.all(actorProfilesPromises);
                const actorProfiles = actorProfilesResponses.map((response) => response.data);
                setSimilarActors(actorProfiles);
            } catch (error) {
                console.error('Error fetching similar actors:', error);
            }
        }
        setShowActors(!showActors);
    };

    return (
        <Page>
            <NavBar />
            <Main>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
                    <ProfilePic src={userProfile?.profilePic || ''} alt="Profile" style={{ width: 150, height: 150, borderRadius: '50%' }} />
                    <h2>{userProfile?.username}</h2>
                    <p>Email: {userProfile?.emailID}</p>
                    <p>Hashtags: {userProfile?.hashtags.join(', ')}</p>
                    {userProfile?.linked_actor_nconst && (
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <img src={userProfile.linked_actor_nconst} alt="Linked Actor" style={{ width: 100, height: 100, borderRadius: '50%' }} />
                            <button onClick={toggleShowActors}>Change Linked Actor</button>
                        </div>
                    )}
                    {showActors && (
                        <div>
                            {similarActors.map(actor => (
                                <div key={actor.userID} style={{ display: 'flex', alignItems: 'center' }}>
                                    <input type="radio" name="actor" onChange={() => handleActorSelection(actor.linked_actor_nconst || '')} />
                                    <img src={actor.profilePic || ''} alt={actor.username} style={{ width: 50, height: 50, borderRadius: '50%' }} />
                                    {actor.username}
                                </div>
                            ))}
                        </div>
                    )}
                    <button onClick={() => navigate('/editProfile')} style={{ position: 'absolute', top: 20, right: 20 }}>
                        Edit Profile
                    </button>
                </div>
            </Main>
        </Page>
    );
};

export default ProfilePage;