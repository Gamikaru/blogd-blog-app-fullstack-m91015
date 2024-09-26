import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from '../../contexts';
import Logger from '../../utils/Logger';

export default function RedirectIfLoggedIn({ children }) {
   const { user, loading } = useUser() || {}; // Add fallback empty object in case of null
   Logger.info(`RedirectIfLoggedIn: User is ${user ? 'logged in' : 'not logged in'}`);

   if (loading) {
      Logger.info('RedirectIfLoggedIn: Loading user data...');
      return <div>Loading...</div>;  // Wait until loading is complete
   }

   Logger.info(`RedirectIfLoggedIn: ${user ? 'Redirecting to home' : 'Rendering children'}`);
   return user ? <Navigate to="/" /> : children;
};
