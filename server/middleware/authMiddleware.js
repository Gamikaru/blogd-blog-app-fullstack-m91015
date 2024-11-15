// middleware/authMiddleware.js

import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import logger from '../utils/logger.js';

dotenv.config();

/**
 * Middleware to authenticate user using JWT.
 */
export const authenticate = (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization) {
        logger.error('Authentication Failed: No token provided', { ip: req.ip });
        return res.status(401).json({ message: 'No token provided' });
    }

    const parts = authorization.split(' ');
    if (parts[0] !== 'Bearer' || parts.length !== 2) {
        logger.error('Authentication Failed: Invalid token format', { ip: req.ip, authorization });
        return res.status(401).json({ message: 'Invalid token format' });
    }

    const token = parts[1];

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        // Check if the decoded token has the required fields
        if (!decodedToken.userId || !decodedToken.email || !decodedToken.authLevel) {
            logger.error('Token payload missing required fields', { token: decodedToken, ip: req.ip });
            return res.status(400).json({ message: 'Invalid token payload' });
        }

        req.user = {
            userId: decodedToken.userId,
            email: decodedToken.email,
            authLevel: decodedToken.authLevel,
        };

        logger.info('User authenticated successfully', { userId: req.user.userId, ip: req.ip });

        next();
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            logger.error('Token expired', { message: err.message, ip: req.ip });
            return res.status(403).json({ message: 'Token expired, please log in again' });
        }
        logger.error('Invalid token', { message: err.message, ip: req.ip });
        return res.status(403).json({ message: 'Invalid token' });
    }
};
