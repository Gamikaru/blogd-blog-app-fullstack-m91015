import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const authenticate = (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization) {
        console.log('Authorization header is missing');
        return res.status(401).send('Authorization header is missing');
    }

    const token = authorization.split(' ')[1];
    if (!token) {
        console.log('Access denied. No token provided.');
        return res.status(401).send('Access denied. No token provided.');
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
        if (err) {
            console.log('Invalid token:', err);
            return res.status(403).send('Invalid token');
        }

        console.log('Decoded token:', decodedToken);
        if (!decodedToken._id && decodedToken.id) {
            decodedToken._id = decodedToken.id;
        }

        req.user = {
            _id: decodedToken._id,
            email: decodedToken.email,
            auth_level: decodedToken.auth_level
        };

        next();
    });
};