// PublicRoute.jsx
import { Spinner } from '@components';
import { useNotificationContext, useUser } from '@contexts';
import { logger } from '@utils';
import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';

/**
 * PublicRoute: A component wrapper to redirect authenticated users away from public routes.
 */
const PublicRoute = React.memo(({ children }) => {
    const { user, loading } = useUser();
    const { setPosition } = useNotificationContext();

    useEffect(() => {
        logger.info('[PublicRoute] Setting toast position for public route.');
        setPosition('info', false);
    }, [setPosition]);

    useEffect(() => {
        if (loading) {
            logger.info('[PublicRoute] Loading user data...');
        } else {
            logger.info(`[PublicRoute] User is ${user ? 'authenticated' : 'not authenticated'}`);
        }
    }, [user, loading]);

    if (loading) {
        return <Spinner message="Checking authentication status..." />;
    }

    if (user) {
        logger.info('[PublicRoute] User authenticated. Redirecting to home...');
        return <Navigate to="/" replace />;
    }

    logger.info('[PublicRoute] Rendering public route content...');
    return children;
});

export default PublicRoute;
