import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useUser, useNotificationContext } from '../../contexts'; // Import contexts
import Logger from '../../utils/Logger';

/**
 * PublicRoute: A component wrapper to redirect authenticated users away from public routes.
 */
const PublicRoute = ({ children }) => {
   const { user, loading } = useUser() || {}; // Add fallback empty object in case of null
   const { setPosition } = useNotificationContext(); // Use notification context for toast positioning

   // Set toast position to center for public routes
   useEffect(() => {
      Logger.info('Setting toast position to center for public routes');
      setPosition('info', false); // Set the default position for public routes to center
   }, [setPosition]);

   // If data is still loading, return a loading indicator
   if (loading) {
      Logger.info('PublicRoute: Loading user data...');
      return <div>Loading...</div>;  // Wait until loading is complete
   }

   // If the user is logged in, redirect them to the homepage
   if (user) {
      Logger.info('PublicRoute: User authenticated. Redirecting to home...');
      return <Navigate to="/" replace />; // Redirect authenticated users
   }

   Logger.info('PublicRoute: Rendering children for public route.');
   return children; // If not logged in, render the public route content
};

export default PublicRoute;
