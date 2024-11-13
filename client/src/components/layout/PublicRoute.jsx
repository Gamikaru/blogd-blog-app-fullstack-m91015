// PublicRoute.jsx
import { Spinner } from '@components';
import { useNotificationContext, useUser } from '@contexts';
import { logger } from '@utils';
import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';

/**
 * PublicRoute: A component wrapper to redirect authenticated users away from public routes.
 */
const PublicRoute = ({ children }) => {
    const { user, loading } = useUser();
    const { setPosition } = useNotificationContext();

    useEffect(() => {
        logger.info('[PublicRoute] Setting toast position for public route.');
        setPosition('info', false);
    }, [setPosition]);

    if (loading) {
        logger.info('[PublicRoute] Loading user data...');
        return <Spinner />;
    }

    if (user) {
        logger.info('[PublicRoute] User authenticated. Redirecting to home...');
        return <Navigate to="/" replace />;
    }

    logger.info('[PublicRoute] Rendering public route content...');
    return children;
};

export default PublicRoute;
