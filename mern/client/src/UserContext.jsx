import React, { createContext, useState, useEffect, useContext } from 'react';
import Cookies from 'universal-cookie';
import ApiClient from './ApiClient'; // Import the configured Axios client

const cookies = new Cookies();

const UserContext = createContext();

/**
 * UserProvider: A context provider component to manage user authentication state.
 */
export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null); // Store user data
    const [loading, setLoading] = useState(true); // Loading state for fetching user data

    // Fetch user data when the component is mounted
    useEffect(() => {
        const fetchUser = async () => {
            const token = cookies.get('PassBloggs'); // Retrieve token from cookies
            const userID = cookies.get('userID');   // Retrieve userID from cookies

            // If token or userID is missing, stop loading and return early
            if (!token || !userID) {
                console.log('No token or userID found.');
                setLoading(false); // End loading state
                return;
            }

            try {
                // Fetch user data from API
                console.log('Fetching user data for userID:', userID);
                const response = await ApiClient.get(`/user/${userID}`);

                // If user data is found, set user state
                if (response.data) {
                    console.log('User data fetched:', response.data);
                    setUser(response.data);
                } else {
                    console.log('No user data found.');
                    setUser(null);
                }
            } catch (error) {
                // Log any errors during the user fetch process
                console.error('Error fetching user data:', error.message);
                setUser(null); // Reset user if error occurs
            } finally {
                setLoading(false); // Ensure loading ends in all cases
            }
        };

        fetchUser(); // Invoke fetch user function on component mount
    }, []);  // Empty dependency array for one-time fetch

    console.log('UserProvider rendered with user:', user);

    // Provide both user and loading states to the context consumers
    return (
        <UserContext.Provider value={{ user, loading, setUser }}>
            {children}
        </UserContext.Provider>
    );
};

// Hook to access the current user and loading state
export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};

// Hook to update the user
export const useUserUpdate = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUserUpdate must be used within a UserProvider');
    }
    return context.setUser;
};

export default UserContext;
