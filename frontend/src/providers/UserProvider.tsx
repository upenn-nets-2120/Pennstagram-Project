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
