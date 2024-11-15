// src/middleware/sanitizeMiddleware.js

import sanitizeContent from '../utils/sanitizeContent.js';
import logger from '../utils/logger.js';

/**
 * Middleware to sanitize specific fields in request body.
 * @param  {...string} fields - The fields to sanitize.
 */
export const sanitizeFields = (...fields) => {
    return (req, res, next) => {
        try {
            fields.forEach(field => {
                if (req.body && req.body[field]) {
                    req.body[field] = sanitizeContent(req.body[field]);
                    logger.info(`Sanitized field '${field}' for user ID: ${req.user?.userId || 'Unauthenticated'}`);
                }
            });
            next();
        } catch (error) {
            logger.error('Sanitization Error:', error);
            res.status(500).json({ message: 'Error sanitizing input data' });
        }
    };
};