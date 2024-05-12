import React, { useState } from 'react';
import { User } from '../entities/User';

const sampleUser: User = {
    userID: 1,
    username: "testUser12345",
    firstName: null,
    lastName: null,
    profilePic: null,
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
    user: User; // Make user non-nullable
    isLoggedIn: boolean;
    login: (user: User) => void;
    logout: () => void;
}>({
    user: sampleUser, // Provide the sampleUser as default
    isLoggedIn: true,
    login: () => {},
    logout: () => {},
});

interface UserProviderProps {
    children: React.ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);

    const login = (user: User) => {
        setIsLoggedIn(true);
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
