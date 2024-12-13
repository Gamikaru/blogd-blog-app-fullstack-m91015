// src/components/PrivateRoute.jsx
import { Spinner } from '@components';
import { useUser } from '@contexts';
import { logger } from '@utils';
import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';

/**
 * PrivateRoute: A component wrapper to protect routes and redirect unauthenticated users.
 */
const PrivateRoute = ({ children }) => {
    const { user, loading } = useUser();

    if (loading) {
        logger.info('[PrivateRoute] Loading user data...');
        return <Spinner />;
    }

    if (!user) {
        logger.info('[PrivateRoute] User not authenticated. Redirecting to login...');
        return <Navigate to="/login" replace />;
    }

    logger.info('[PrivateRoute] User authenticated. Rendering children...');
    return children;
};

PrivateRoute.displayName = 'PrivateRoute';

PrivateRoute.propTypes = {
    children: PropTypes.node.isRequired,
};

export default PrivateRoute;
