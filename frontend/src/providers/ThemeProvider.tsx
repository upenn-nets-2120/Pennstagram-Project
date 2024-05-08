import React, { useState } from 'react';
import { Theme } from '../entities/Theme';
import { lightTheme, darkTheme } from '../constants/themes';

export const ThemeContext = React.createContext<{
    theme: Theme;
    toggleTheme: () => void;
}>({
    theme: lightTheme,
    toggleTheme: () => {}
});

interface ThemeProviderProps {
    children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
    const [theme, setTheme] = useState<Theme>(lightTheme);

    const toggleTheme = () => {
        setTheme(prevTheme => (prevTheme.mode === 'light' ? darkTheme : lightTheme));
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export default ThemeProvider;
