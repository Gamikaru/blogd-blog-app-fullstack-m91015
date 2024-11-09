import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

/**
 * @middleware authenticate
 * @desc       Middleware to authenticate user using JWT
 */
export const authenticate = (req, res, next) => {
    const { authorization } = req.headers;

    // Check if the authorization header is present
    if (!authorization) {
        return res.status(401).json({ message: 'No token provided' });
    }

    console.log('Authorization header received');

    // Ensure token is in the correct format "Bearer <token>"
    const parts = authorization.split(' ');
    if (parts[0] !== 'Bearer' || parts.length !== 2) {
        return res.status(401).json({ message: 'Invalid token format' });
    }

    const token = parts[1];

    // Verify the JWT token
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
        if (err) {
            if (err.name === 'TokenExpiredError') {
                console.error('Token expired:', err.message);
                return res.status(403).send('Token expired, please log in again');
            }
            console.error('Invalid token:', err.message);
            return res.status(403).send(`Invalid token: ${err.message}`);
        }

        console.log('Decoded token:', decodedToken);

        // Check if the decoded token has the required fields
        if (!decodedToken._id || !decodedToken.email || !decodedToken.authLevel) {
            console.log('Token payload missing required fields');
            return res.status(400).send('Invalid token payload');
        }

        // Set the user information on the request object
        req.user = {
            _id: decodedToken._id,
            email: decodedToken.email,
            authLevel: decodedToken.authLevel,
        };

        console.log('User authenticated successfully');

        // Continue to the next middleware or route
        next();
    });
};
