// middleware/authMiddleware.js

import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

/**
 * Middleware to authenticate user using JWT.
 */
export const authenticate = (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization) {
        console.error('Authentication Failed: No token provided');
        return res.status(401).json({ message: 'No token provided' });
    }

    const parts = authorization.split(' ');
    if (parts[0] !== 'Bearer' || parts.length !== 2) {
        console.error('Authentication Failed: Invalid token format');
        return res.status(401).json({ message: 'Invalid token format' });
    }

    const token = parts[1];

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        // Check if the decoded token has the required fields
        if (!decodedToken.userId || !decodedToken.email || !decodedToken.authLevel) {
            console.error('Token payload missing required fields');
            return res.status(400).json({ message: 'Invalid token payload' });
        }

        req.user = {
            userId: decodedToken.userId,
            email: decodedToken.email,
            authLevel: decodedToken.authLevel,
        };

        console.log('User authenticated successfully with user ID:', req.user.userId);

        next();
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            console.error('Token expired:', err.message);
            return res.status(403).json({ message: 'Token expired, please log in again' });
        }
        console.error('Invalid token:', err.message);
        return res.status(403).json({ message: 'Invalid token' });
    }
};
