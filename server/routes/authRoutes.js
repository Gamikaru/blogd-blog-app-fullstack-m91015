// routes/authRoutes.js

import express from 'express';
import { body } from 'express-validator';
import {
    forgotPassword,
    loginUser,
    logoutUser,
    registerUser,
    resetPassword
} from '../controllers/authController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

/**
 * @route   POST /auth/register
 * @desc    Register a new user with profile and cover photos
 * @access  Public
 */
router.post(
    '/register',
    upload.fields([
        { name: 'profilePicture', maxCount: 1 },
        { name: 'coverPicture', maxCount: 1 },
    ]),
    [
        body('firstName').notEmpty().withMessage('First Name is required'),
        body('lastName').notEmpty().withMessage('Last Name is required'),
        body('birthDate').isISO8601().toDate().withMessage('Valid Birth Date is required'),
        body('email').isEmail().withMessage('Valid Email is required'),
        body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
        body('location').notEmpty().withMessage('Location is required'),
        body('occupation').notEmpty().withMessage('Occupation is required'),
        body('authLevel').optional().isIn(['basic', 'admin']).withMessage('Invalid Auth Level'),
    ],
    registerUser
);

/**
 * @route   POST /auth/login
 * @desc    Authenticate user and get token
 * @access  Public
 */
router.post(
    '/login',
    [
        body('email').isEmail().withMessage('Valid Email is required'),
        body('password').notEmpty().withMessage('Password is required'),
    ],
    loginUser
);

/**
 * @route   POST /auth/logout
 * @desc    Logout user and delete session
 * @access  Private
 */
router.post('/logout', authenticate, logoutUser);

/**
 * @route   POST /auth/forgot-password
 * @desc    Send password reset email
 * @access  Public
 */
router.post(
    '/forgot-password',
    [body('email').isEmail().withMessage('Valid Email is required')],
    forgotPassword
);

/**
 * @route   POST /auth/reset-password
 * @desc    Reset password
 * @access  Public
 */
router.post(
    '/reset-password',
    [
        body('token').notEmpty().withMessage('Token is required'),
        body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters'),
    ],
    resetPassword
);

export default router;