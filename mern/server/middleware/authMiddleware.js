import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

// Middleware to authenticate token
export const authenticate = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        console.log('Authorization header is missing');
        return res.status(401).send('Authorization header is missing');
    }

    const token = authHeader.split(' ')[1]; // Split the header to extract the token
    if (!token) {
        console.log('Access denied. No token provided.');
        return res.status(401).send('Access denied. No token provided.');
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            console.log('Invalid token:', err);
            return res.status(403).send('Invalid token');
        }
        console.log('User:', user);
        console.log('Token:', token);
        console.log('Token verified');
        req.user = user; // Set the user object to req.user
        next();
    });
}


