import React, { useState, useEffect, useContext } from 'react';
import { getFollowing } from '../../../hooks/get-following';
import { User } from '../../../entities/User';
import { UserContext } from '../../../providers/UserProvider';
import { postCreateChat } from '../../../hooks/post-create-chat';
import { useNavigate } from 'react-router-dom';

const CreateChat: React.FC = () => {
    const [name, setName] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [profilePic, setProfilePic] = useState<string>('');
    const [isAdmin, setIsAdmin] = useState<boolean>(false);
    const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
    const [allUsers, setAllUsers] = useState<User[]>([]);

    const { user, isLoggedIn } = useContext(UserContext);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchUsers = async () => {
            const users = await getFollowing(isLoggedIn && user?.userID ? user?.userID : 1);
            setAllUsers(users);
        };

        fetchUsers();
    }, [isLoggedIn, user]);

    const handleUserToggle = (userId: User) => {
        if (selectedUsers.some((user) => user.userID === userId.userID)) {
            setSelectedUsers(selectedUsers.filter((user) => user.userID !== userId.userID));
        } else {
            setSelectedUsers([...selectedUsers, userId]);
        }
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        try {
            if (!user) {
                throw new Error;
            }
            const result = await postCreateChat(user, name, description, profilePic, isAdmin, selectedUsers.map(user => user.userID));
            console.log(result);
            navigate(`/chat/${result.chatID}`);
        } catch (error) {
            console.log("handle this error later");
            console.log(error);
        }
    };

    return (
        <div>
            <h1>Create Chat</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Name:</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div>
                    <label>Description:</label>
                    <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} />
                </div>
                <div>
                    <label>Profile Picture:</label>
                    <input type="text" value={profilePic} onChange={(e) => setProfilePic(e.target.value)} />
                </div>
                <div>
                    <label>Is Admin:</label>
                    <input type="checkbox" checked={isAdmin} onChange={(e) => setIsAdmin(e.target.checked)} />
                </div>
                <div>
                    <h2>Select Users:</h2>
                    {allUsers.map((user) => (
                        <div key={user.userID}>
                            <input
                                type="checkbox"
                                id={String(user.userID)}
                                checked={selectedUsers.some((selectedUser) => selectedUser.userID === user.userID)}
                                onChange={() => handleUserToggle(user)}
                            />
                            <label htmlFor={String(user.userID)}>{user.username}</label>
                        </div>
                    ))}
                </div>
                <button type="submit">Create Chat</button>
            </form>
        </div>
    );
};

export default CreateChat;
