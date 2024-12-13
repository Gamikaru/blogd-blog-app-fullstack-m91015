// src/validators/commentValidate.js

import { body, validationResult } from 'express-validator';

// Middleware to handle validation errors
export const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // Return the first validation error message
        return res.status(400).json({ message: errors.array()[0].msg });
    }
    next();
};

// Validation rules for creating a comment
export const validateCreateComment = [
    body('content')
        .trim()
        .notEmpty().withMessage('Content is required')
        .isLength({ min: 1, max: 10000 }).withMessage('Content must be between 1 and 10,000 characters'),
    body('postId')
        .notEmpty().withMessage('Post ID is required')
        .isMongoId().withMessage('Invalid Post ID'),
    handleValidationErrors,
];