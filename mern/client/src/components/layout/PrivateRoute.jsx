import React from 'react';
import { useCookies } from 'react-cookie';
import { useUser } from '../../contexts'; // Import UserContext
import Logger from '../../utils/Logger';
import { Navigate } from 'react-router-dom'; // Import Navigate component from react-router-dom

/**
 * PrivateRoute: A component wrapper to protect routes and redirect unauthenticated users.
 */
const PrivateRoute = ({ children }) => {
   const [cookies] = useCookies(['PassBloggs']);
   const token = cookies.PassBloggs; // Get the token from cookies
   const { user, loading } = useUser() || {}; // Add fallback empty object in case of null

   // If data is still loading, return a loading indicator
   if (loading) {
      Logger.info('PrivateRoute: Loading user data...');
      return <div>Loading...</div>;
   }

   // If no token or user is found, return a loading state or redirect
   if (!token || !user) {
      Logger.info('User not authenticated. Redirecting to login...');
      return <Navigate to="/login" replace />;  // Replace window.location.href with Navigate component
   }

   // If user is authenticated, return the children components (protected content)
   return children;
};

export default PrivateRoute;
