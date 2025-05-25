import { createContext, useContext, useEffect, useState } from 'react';

const DarkModeContext = createContext();

export const DarkModeProvider = ({ children }) => {
    const [darkMode, setDarkMode] = useState(() => {
        try {
            const savedMode = localStorage.getItem('mindsharehub_darkMode');
            if (savedMode !== null) {
                return savedMode === 'true';
            }
            return window.matchMedia('(prefers-color-scheme: dark)').matches;
        } catch {
            return false;
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem('mindsharehub_darkMode', darkMode);
            if (darkMode) {
                document.documentElement.classList.add('dark');
                document.body.style.backgroundColor = '#36393f';
            } else {
                document.documentElement.classList.remove('dark');
                document.body.style.backgroundColor = '';
            }
        } catch (e) {
            console.error('Error saving dark mode preference:', e);
        }
    }, [darkMode]);

    useEffect(() => {
        const handleStorageChange = (e) => {
            if (e.key === 'mindsharehub_darkMode') {
                setDarkMode(e.newValue === 'true');
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    const toggleDarkMode = () => {
        setDarkMode(prev => !prev);
    };

    return (
        <DarkModeContext.Provider value={{ darkMode, toggleDarkMode }}>
            {children}
        </DarkModeContext.Provider>
    );
};

export const useDarkMode = () => {
    const context = useContext(DarkModeContext);
    if (context === undefined) {
        throw new Error('useDarkMode must be used within a DarkModeProvider');
    }
    return context;
};
