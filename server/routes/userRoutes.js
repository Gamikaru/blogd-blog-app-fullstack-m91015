// routes/userRoutes.js

import express from 'express';
import { body } from 'express-validator';
import {
    deleteProfilePicture,
    deleteUserByEmail,
    deleteUserById,
    getAllUsers,
    getUserById,
    listUsers,
    updateUser,
    updateUserStatus,
    verifyEmail,
} from '../controllers/userController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

/**
 * @route   GET /user/verify-email
 * @desc    Verify user's email
 * @access  Public
 */
router.get('/verify-email', verifyEmail);

/**
 * @route   GET /user/:userId
 * @desc    Get user by ID (protected)
 * @access  Private
 */
router.get('/:userId', authenticate, getUserById);

/**
 * @route   PATCH /user/:userId
 * @desc    Update user by ID with profile and cover photos
 * @access  Private
 */
router.patch(
    '/:userId',
    authenticate,
    upload.fields([
        { name: 'profilePicture', maxCount: 1 },
        { name: 'coverPicture', maxCount: 1 },
    ]),
    [
        body('firstName').optional().isString().withMessage('First name must be a string'),
        body('lastName').optional().isString().withMessage('Last name must be a string'),
        body('email').optional().isEmail().withMessage('Invalid email format'),
        body('birthDate').optional().isISO8601().toDate().withMessage('Invalid birth date'),
        body('location').optional().isString().withMessage('Location must be a string'),
        body('occupation').optional().isString().withMessage('Occupation must be a string'),
        body('authLevel').optional().isIn(['basic', 'admin']).withMessage('Invalid auth level'),
        body('status').optional().isString().withMessage('Status must be a string'),
    ],
    updateUser
);

/**
 * @route   GET /user/list/:userId
 * @desc    Get all users except the current user
 * @access  Public
 */
router.get('/list/:userId', listUsers);

/**
 * @route   GET /user/
 * @desc    Get all users
 * @access  Private
 */
router.get('/', authenticate, getAllUsers);

/**
 * @route   DELETE /user/:userId
 * @desc    Delete user by ID
 * @access  Private
 */
router.delete('/:userId', authenticate, deleteUserById);

/**
 * @route   DELETE /user/email/:email
 * @desc    Delete user by email
 * @access  Private
 */
router.delete('/email/:email', authenticate, deleteUserByEmail);

/**
 * @route   PUT /user/:userId/status
 * @desc    Update user status
 * @access  Private
 */
router.put(
    '/:userId/status',
    authenticate,
    [body('status').isString().withMessage('Status must be a string')],
    updateUserStatus
);

/**
 * @route   DELETE /user/:userId/profile-picture
 * @desc    Delete user's profile picture
 * @access  Private
 */
router.delete('/:userId/profile-picture', authenticate, deleteProfilePicture);


export default router;