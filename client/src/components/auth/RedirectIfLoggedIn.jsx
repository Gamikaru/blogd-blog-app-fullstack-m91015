//redirectifloggedin.jsx
//Desc: Redirects to home page if user is already logged in

import { Spinner } from '@components'; // Assuming Spinner is a reusable loader component
import { useUser } from '@contexts';
import { logger } from '@utils';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function RedirectIfLoggedIn({ children }) {
    const { user, loading } = useUser() || {};
    const navigate = useNavigate();

    useEffect(() => {
        if (loading) {
            logger.info('RedirectIfLoggedIn: Loading user data...');
        } else {
            logger.info(`RedirectIfLoggedIn: User is ${user ? 'logged in' : 'not logged in'}`);
        }
    }, [user, loading]);

    useEffect(() => {
        if (!loading && user) {
            logger.info('RedirectIfLoggedIn: Redirecting to home as user is logged in.');
            navigate('/'); // Redirect to home if logged in
        }
    }, [user, loading, navigate]);

    if (loading) {
        return <Spinner message="Checking login status..." />;
    }

    return children;
}
