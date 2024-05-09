import React, { useState } from 'react';
import { User } from '../entities/User';

const sampleUser: User = {
    userID: 1,
    username: "sampleUser",
    firstName: "John",
    lastName: "Doe",
    profilePic: "https://example.com/profilepic.jpg",
    online: true,
    relationship: 'Following',
};

export const UserContext = React.createContext<{
    user: User | undefined;
    isLoggedIn: boolean; // Add isLoggedIn field
    login: (user: User) => void;
    logout: () => void;
}>({
    user: undefined,
    isLoggedIn: false, // Initialize isLoggedIn as false
    login: () => {},
    logout: () => {},
});

interface UserProviderProps {
    children: React.ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | undefined>(sampleUser);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);

    const login = (user: User) => {
        setUser(user);
        setIsLoggedIn(true);
    }

    const logout = () => {
        setUser(undefined);
        setIsLoggedIn(false);
    }

    return (
        <UserContext.Provider value={{ user, isLoggedIn, login, logout }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserProvider;
