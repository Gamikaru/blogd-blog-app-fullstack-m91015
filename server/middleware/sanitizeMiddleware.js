// middleware/sanitizeMiddleware.js

import { sanitizeContent } from '../utils/sanitizeContent.js';

/**
 * Middleware to sanitize post content.
 */
export const sanitizePostContent = (req, res, next) => {
    if (req.body && req.body.content) {
        req.body.content = sanitizeContent(req.body.content);
    }
    next();
};