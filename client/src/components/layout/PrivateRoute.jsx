// PrivateRoute.jsx
import { Spinner } from '@components';
import { useUser } from '@contexts';
import { logger } from '@utils';
import { useCookies } from 'react-cookie';
import { Navigate } from 'react-router-dom';

/**
 * PrivateRoute: A component wrapper to protect routes and redirect unauthenticated users.
 */
const PrivateRoute = ({ children }) => {
    const [cookies] = useCookies(['BlogdPass']);
    const token = cookies.BlogdPass;
    const { user, loading } = useUser();

    if (loading) {
        logger.info('[PrivateRoute] Loading user data...');
        return <Spinner />;
    }

    if (!token || !user) {
        logger.info('[PrivateRoute] User not authenticated. Redirecting to login...');
        return <Navigate to="/login" replace />;
    }

    logger.info('[PrivateRoute] User authenticated. Rendering children...');
    return children;
};

export default PrivateRoute;
