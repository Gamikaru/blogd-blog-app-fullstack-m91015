// src/contexts/UserContext.jsx

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import Cookies from 'universal-cookie';
import { ApiClient } from '../services/api';

export const UserContext = createContext();

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};

export const useUserUpdate = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUserUpdate must be used within a UserProvider');
    }
    return context.setUser;
};

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null); // Store user data
    const [loading, setLoading] = useState(true); // Loading state for fetching user data

    // Fetch user data when the component is mounted
    useEffect(() => {
        const fetchUser = async () => {
            console.debug('Fetching user data...');
            const cookies = new Cookies();
            const token = cookies.get('BlogdPass');
            const userID = cookies.get('userID');

            console.debug('Token:', token);
            console.debug('userID:', userID);

            // If token or userID is missing, stop loading and return early
            if (!token || !userID) {
                console.debug('Token or userID is missing. Stopping loading.');
                setLoading(false);
                return;
            }

            try {
                // Make sure userID is a string
                const userId = String(userID);
                console.debug('Fetching user data from API for userId:', userId);

                const response = await ApiClient.get(`/user/${userId}`);

                if (response.data) {
                    console.debug('User data fetched successfully:', response.data);
                    const fetchedUser = response.data;
                    fetchedUser.userId = fetchedUser.userId || fetchedUser._id; // Ensure userId is present
                    setUser(fetchedUser);
                } else {
                    console.debug('No user data found.');
                    setUser(null);
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
                // Clear cookies on error
                cookies.remove('BlogdPass', { path: '/' });
                cookies.remove('userID', { path: '/' });
                setUser(null);
            } finally {
                console.debug('Finished fetching user data.');
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    const contextValue = useMemo(
        () => ({
            user,
            loading,
            setUser,
        }),
        [user, loading]
    );

    return <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>;
};
