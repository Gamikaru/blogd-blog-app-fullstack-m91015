import { Logger, useUser } from '@components';
import React from 'react';

export default function RedirectIfLoggedIn({ children }) {
    const { user, loading } = useUser() || {}; // Add fallback empty object in case of null
    Logger.info(`RedirectIfLoggedIn: User is ${user ? 'logged in' : 'not logged in'}`);

    if (loading) {
        Logger.info('RedirectIfLoggedIn: Loading user data...');
        return <div>Loading...</div>;  // Wait until loading is complete
    }

    // Instead of automatically redirecting, we simply render the children or message
    return user ? <div>User is logged in</div> : children;
}
