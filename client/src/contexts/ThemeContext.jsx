// src/contexts/ThemeContext.jsx

import PropTypes from 'prop-types';
import { createContext, useContext, useEffect, useState } from 'react';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(() => {
        const savedTheme = window.localStorage.getItem('theme');
        return savedTheme || 'light';
    });

    const toggleTheme = () => {
        setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
    };

    useEffect(() => {
        // Remove existing classes in case we previously applied them
        document.documentElement.classList.remove('light-theme', 'dark-theme');
        document.documentElement.classList.add(`${theme}-theme`);
        window.localStorage.setItem('theme', theme);
    }, [theme]);

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

ThemeProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

// Custom hook for consuming ThemeContext
export const useThemeContext = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useThemeContext must be used within a ThemeProvider');
    }
    return context;
};