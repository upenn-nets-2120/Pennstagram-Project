import React, { useState } from 'react';
import { User } from '../entities/User';

export const UserContext = React.createContext<{
    user: User | undefined;
    login: (user: User) => void; // Update the login function signature
    logout: () => void;
}>({
    user: undefined,
    login: () => {},
    logout: () => {},
});

interface UserProviderProps {
    children: React.ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | undefined>(undefined);

    const login = (user: User) => {
        setUser(user);
    }

    const logout = () => {
        setUser(undefined);
    }

    return (
        <UserContext.Provider value={{ user, login, logout }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserProvider;
