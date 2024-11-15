// PublicRoute.jsx
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Spinner } from '@components';
import { useNotificationContext, useUser } from '@contexts';
import { logger } from '@utils';
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

PublicRoute.displayName = 'PublicRoute';

PublicRoute.propTypes = {
    children: PropTypes.node.isRequired,
};

export default PublicRoute;
