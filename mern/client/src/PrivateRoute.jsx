import React from 'react';
import { useCookies } from 'react-cookie';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
    const [cookies] = useCookies(['PassBloggs']);
    const token = cookies.PassBloggs;

    // If token exists, allow access to the route, otherwise redirect to login
    return token ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
