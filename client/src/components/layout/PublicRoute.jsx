// PublicRoute.jsx
import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useUser, useNotificationContext } from '../../contexts';
import { useCookies } from 'react-cookie';
import Logger from '../../utils/Logger';

const PublicRoute = ({ children }) => {
   const { user, loading } = useUser() || {};
   const { setPosition } = useNotificationContext();
   const [cookies] = useCookies(['PassBloggs']);
   const token = cookies.PassBloggs;

   useEffect(() => {
      Logger.info('Setting toast position to center for public routes');
      setPosition('info', false);
   }, [setPosition]);

   if (loading) {
      Logger.info('PublicRoute: Loading user data...');
      return <div>Loading...</div>;
   }

   if (user && token) {
      Logger.info('PublicRoute: User authenticated. Redirecting to home...');
      return <Navigate to="/" replace />;
   }

   Logger.info('PublicRoute: Rendering children for public route.');
   return children;
};

export default PublicRoute;
