import React, { useState } from 'react';
import { User } from '../entities/User';

const sampleUser: User = {
    userID: 2,
    username: "testUser12345",
    firstName: '',
    lastName: '',
    profilePic: '',
    salted_password: null,
    emailID: null,
    actors: null,
    birthday: null,
    affiliation: null,
    linked_actor_nconst: null,
    inviters: null,
    userProfilePic: null,
    userScore: null,
    userVisibility: null,
    sessionToken: null,
    follows_back: null,
    requested: null
};


export const UserContext = React.createContext<{
    user: User;
    isLoggedIn: boolean;
    login: (user: User) => void;
    logout: () => void;
}>({
    user: sampleUser,
    isLoggedIn: true,
    login: () => {},
    logout: () => {},
});

interface UserProviderProps {
    children: React.ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);
    const [user, setUser] = useState<User>(sampleUser);

    const login = (user: User) => {
        setIsLoggedIn(true);
        setUser(user);
    }

    const logout = () => {
        setIsLoggedIn(false);
    }

    return (
        <UserContext.Provider value={{ user: isLoggedIn ? sampleUser : {} as User, isLoggedIn, login, logout }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserProvider;
