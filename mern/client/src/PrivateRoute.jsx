import React from 'react';
import { useCookies } from 'react-cookie';
import { useUser } from './UserContext';

/**
 * PrivateRoute: A component wrapper to protect routes and redirect unauthenticated users.
 */
const PrivateRoute = ({ children }) => {
    const [cookies] = useCookies(['PassBloggs']);
    const token = cookies.PassBloggs; // Get the token from cookies
    const { user, loading } = useUser() || {}; // Add fallback empty object in case of null

    // If data is still loading, return a loading indicator
    if (loading) {
        return <div>Loading...</div>;
    }

    // If no token or user is found, return a loading state or redirect
    if (!token || !user) {
        console.log('User not authenticated. Redirecting to login...');
        window.location.href = '/login'; // Redirect to login
        return null;  // Prevent further rendering
    }

    // If user is authenticated, return the children components (protected content)
    return children;
};

export default PrivateRoute;
