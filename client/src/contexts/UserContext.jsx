import { ApiClient } from '@components';
import React, { createContext, useContext, useEffect, useState } from 'react';
import Cookies from 'universal-cookie';

const cookies = new Cookies();

const UserContext = createContext();

/**
 * UserProvider: A context provider component to manage user authentication state.
 */
const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null); // Store user data
    const [loading, setLoading] = useState(true); // Loading state for fetching user data

    // Fetch user data when the component is mounted
    useEffect(() => {
        const fetchUser = async () => {
            const token = cookies.get('PassBloggs');
            const userID = cookies.get('userID');

            // Log the fetched userID and token from cookies
            console.debug('Fetched userID from cookies:', userID, 'Type:', typeof userID);
            console.debug('Fetched token from cookies:', token, 'Type:', typeof token);

            // If token or userID is missing, stop loading and return early
            if (!token || !userID) {
                console.warn('No token or userID found. Stopping loading.');
                setLoading(false);
                return;
            }

            try {
                // Make sure userID is a string
                const userId = String(userID);
                console.debug('Converted userId:', userId);

                console.info('Fetching user data for userID:', userId);
                const response = await ApiClient.get(`/user/${userId}`);

                if (response.data) {
                    console.info('User data fetched successfully:', response.data);
                    setUser(response.data);
                } else {
                    console.warn('No user data found for userID:', userId);
                    setUser(null);
                }
            } catch (error) {
                console.error('Error fetching user data:', error.message);
                // Clear cookies on error
                cookies.remove('PassBloggs', { path: '/' });
                cookies.remove('userID', { path: '/' });
                setUser(null);
            } finally {
                setLoading(false);
                console.debug('Finished fetching user data. Loading state set to false.');
            }
        };

        fetchUser();
    }, []);

    console.debug('UserProvider rendered with user:', user);

    // Provide both user and loading states to the context consumers
    return (
        <UserContext.Provider value={{ user, loading, setUser }}>
            {children}
        </UserContext.Provider>
    );
};

// Hook to access the current user and loading state
const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};

// Hook to update the user
const useUserUpdate = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUserUpdate must be used within a UserProvider');
    }
    return context.setUser;
};

export default UserProvider;
export { useUser, useUserUpdate };
