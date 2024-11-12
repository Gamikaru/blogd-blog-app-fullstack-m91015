// routes/userRoutes.js

import bcrypt from 'bcrypt';
import crypto from 'crypto';
import dotenv from 'dotenv';
import express from 'express';
import { body, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import { uploadToCloudinary } from '../config/cloudinaryConfig.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';
import Session from '../models/sessionSchema.js';
import User from '../models/userSchema.js';
import { sendResetPasswordEmail, sendVerificationEmail } from '../services/emailService.js';
import logger from '../utils/logger.js';

dotenv.config();

const router = express.Router();

/**
 * @route   POST /register
 * @desc    Register a new user with profile and cover photos
 * @access  Public
 */
router.post(
    '/register',
    upload.fields([
        { name: 'profilePicture', maxCount: 1 },
        { name: 'coverPhoto', maxCount: 1 },
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
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            logger.error('User Registration: Validation errors', { errors: errors.array() });
            return res.status(400).json({ errors: errors.array() });
        }

        const {
            firstName,
            lastName,
            birthDate,
            email,
            password,
            location,
            occupation,
            authLevel,
        } = req.body;

        try {
            // Check if user already exists
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                logger.error('User Registration: User already exists with email', { email });
                return res.status(400).json({ message: 'User with this email already exists.' });
            }

            let profilePictureUrl = '';
            let coverPhotoUrl = '';

            // Handle profile picture upload
            if (req.files['profilePicture'] && req.files['profilePicture'][0]) {
                const profilePicture = req.files['profilePicture'][0];
                const profileFilename = `profile_${Date.now()}_${profilePicture.originalname}`;
                profilePictureUrl = await uploadToCloudinary(profilePicture.buffer, profileFilename);
            }

            // Handle cover photo upload
            if (req.files['coverPhoto'] && req.files['coverPhoto'][0]) {
                const coverPhoto = req.files['coverPhoto'][0];
                const coverFilename = `cover_${Date.now()}_${coverPhoto.originalname}`;
                coverPhotoUrl = await uploadToCloudinary(coverPhoto.buffer, coverFilename);
            }

            const user = new User({
                firstName,
                lastName,
                birthDate,
                email,
                password,
                location,
                occupation,
                authLevel,
                profilePicture: profilePictureUrl,
                coverPhoto: coverPhotoUrl, // Ensure 'coverPhoto' is defined in the User schema
            });

            const token = crypto.randomBytes(32).toString('hex');
            user.verificationToken = token;
            await user.save();

            await sendVerificationEmail(user, token);

            logger.info('User Registration: User registered successfully', { userId: user._id });
            res.status(201).json({
                message: 'User registered successfully. Please check your email to verify your account.',
            });
        } catch (error) {
            logger.error('User Registration: Error during registration', { error: error.message });
            res.status(500).json({ error: 'Server error during registration' });
        }
    }
);

// Verify email
router.get('/verify-email', async (req, res) => {
    const { token } = req.query;
    logger.info('Email Verification: Received token', { token });

    try {
        const user = await User.findOne({ verificationToken: token });

        if (!user) {
            logger.error('Email Verification: Invalid or expired token', { token });
            return res.status(400).json({ error: 'Invalid or expired token' });
        }

        user.emailVerified = true;
        user.verificationToken = undefined;
        await user.save();

        logger.info('Email Verification: Email verified successfully', { userId: user._id });
        res.status(200).json({ message: 'Email verified successfully' });
    } catch (error) {
        logger.error('Email Verification: Error during email verification', { error: error.message });
        res.status(500).json({ error: 'Server error during email verification' });
    }
});

/**
 * @route   POST /login
 * @desc    Authenticate user and get token
 * @access  Public
 */
router.post(
    '/login',
    [
        body('email').isEmail().withMessage('Valid Email is required'),
        body('password').notEmpty().withMessage('Password is required'),
    ],
    async (req, res) => {
        logger.info('User Login: Attempting login', { email: req.body.email });
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            logger.error('User Login: Validation errors', { errors: errors.array() });
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;

        try {
            const user = await User.findOne({ email });
            if (!user) {
                logger.error('User Login: User not found', { email });
                return res.status(404).json({ message: 'No user found with this email.' });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                logger.error('User Login: Incorrect password', { userId: user._id });
                return res.status(401).json({ message: 'Incorrect password for this user.' });
            }

            const token = jwt.sign(
                { userId: user._id, email: user.email, authLevel: user.authLevel },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );

            logger.info('User Login: Token generated successfully', { userId: user._id });
            res.status(200).json({
                token,
                user: {
                    userId: user._id,
                    email: user.email,
                    authLevel: user.authLevel,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    location: user.location,
                    occupation: user.occupation,
                    profilePicture: user.profilePicture,
                    coverPhoto: user.coverPhoto,
                },
                message: 'Login successful',
            });
        } catch (error) {
            logger.error('User Login: Error during login', { error: error.message });
            return res.status(500).json({ message: 'Server error: ' + error.message });
        }
    }
);

/**
 * @route   POST /forgot-password
 * @desc    Send password reset email
 * @access  Public
 */
router.post(
    '/forgot-password',
    [body('email').isEmail().withMessage('Valid Email is required')],
    async (req, res) => {
        logger.info('Password Reset Request: Received email', { email: req.body.email });
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            logger.error('Password Reset Request: Validation errors', { errors: errors.array() });
            return res.status(400).json({ errors: errors.array() });
        }

        const { email } = req.body;

        try {
            const user = await User.findOne({ email });

            if (!user) {
                logger.error('Password Reset Request: User not found', { email });
                return res.status(404).json({ error: 'User not found' });
            }

            const token = crypto.randomBytes(32).toString('hex');
            user.resetPasswordToken = token;
            user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
            await user.save();

            await sendResetPasswordEmail(user, token);

            logger.info('Password Reset Request: Password reset email sent', { userId: user._id });
            res.status(200).json({ message: 'Password reset email sent' });
        } catch (error) {
            logger.error('Password Reset Request: Error sending password reset email', { error: error.message });
            res.status(500).json({ error: 'Server error during password reset request' });
        }
    }
);

/**
 * @route   POST /reset-password
 * @desc    Reset password
 * @access  Public
 */
router.post(
    '/reset-password',
    [
        body('token').notEmpty().withMessage('Token is required'),
        body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters'),
    ],
    async (req, res) => {
        logger.info('Password Reset: Received token', { token: req.body.token });
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            logger.error('Password Reset: Validation errors', { errors: errors.array() });
            return res.status(400).json({ errors: errors.array() });
        }

        const { token, newPassword } = req.body;

        try {
            const user = await User.findOne({
                resetPasswordToken: token,
                resetPasswordExpires: { $gt: Date.now() },
            });

            if (!user) {
                logger.error('Password Reset: Invalid or expired token', { token });
                return res.status(400).json({ error: 'Invalid or expired token' });
            }

            user.password = newPassword;
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;
            await user.save();

            logger.info('Password Reset: Password reset successfully', { userId: user._id });
            res.status(200).json({ message: 'Password reset successfully' });
        } catch (error) {
            logger.error('Password Reset: Error resetting password', { error: error.message });
            res.status(500).json({ error: 'Server error during password reset' });
        }
    }
);

/**
 * @route   GET /:userId
 * @desc    Get user by ID (protected)
 * @access  Private
 */
router.get('/:userId', authenticate, async (req, res) => {
    const { userId } = req.params;
    logger.info('Fetching user data', { userId });
    try {
        // Find user by ID and exclude password
        const user = await User.findById(userId).select('-password');
        if (!user) {
            logger.error('Get User: User not found', { userId });
            return res.status(404).json({ message: 'User not found' });
        }
        logger.info('Get User: User data retrieved successfully', { userId });
        res.status(200).json(user);
    } catch (error) {
        logger.error('Get User: Error fetching user', { error: error.message });
        return res.status(500).json({ message: 'Server error: ' + error.message });
    }
});

/**
 * @route   PATCH /:userId
 * @desc    Update user by ID with profile and cover photos
 * @access  Private
 */
router.patch(
    '/:userId',
    authenticate,
    upload.fields([
        { name: 'profilePicture', maxCount: 1 },
        { name: 'coverPhoto', maxCount: 1 },
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
        body('profilePicture').optional().isString().withMessage('Profile picture must be a valid URL or base64 string'),
    ],
    async (req, res) => {
        const { userId } = req.params;
        const { authLevel, userId: authUserId } = req.user; // Assuming authenticate middleware adds user info to req.user

        // Authorization Check: Only the user themselves or an admin can update the profile
        if (String(authUserId) !== String(userId) && authLevel !== 'admin') {
            logger.warn('Update User: Forbidden access attempt', { authUserId, targetUserId: userId });
            return res.status(403).json({ message: 'Forbidden: You can only update your own profile.' });
        }

        // Validation Check
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            logger.error('Update User: Validation errors', { errors: errors.array() });
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const user = await User.findById(userId);
            if (!user) {
                logger.error('Update User: User not found', { userId });
                return res.status(404).json({ message: 'User not found' });
            }

            // Update only allowed fields
            const fieldsToUpdate = req.body;
            const allowedUpdates = [
                'firstName',
                'lastName',
                'birthDate',
                'email',
                'location',
                'occupation',
                'authLevel',
                'status',
                'profilePicture',
            ];
            allowedUpdates.forEach((field) => {
                if (fieldsToUpdate[field] !== undefined) {
                    user[field] = fieldsToUpdate[field];
                }
            });

            // Handle profile picture upload
            if (req.files['profilePicture'] && req.files['profilePicture'][0]) {
                const profilePicture = req.files['profilePicture'][0];
                const profileFilename = `profile_${Date.now()}_${profilePicture.originalname}`;
                user.profilePicture = await uploadToCloudinary(profilePicture.buffer, profileFilename);
            }

            // Handle cover photo upload
            if (req.files['coverPhoto'] && req.files['coverPhoto'][0]) {
                const coverPhoto = req.files['coverPhoto'][0];
                const coverFilename = `cover_${Date.now()}_${coverPhoto.originalname}`;
                user.coverPhoto = await uploadToCloudinary(coverPhoto.buffer, coverFilename);
            }

            await user.save(); // Save the updated user data
            logger.info('Update User: User updated successfully', { userId: user._id });
            res.status(200).json(user); // Send updated user back to front-end
        } catch (error) {
            logger.error('Update User: Error updating user', { error: error.message, userId });
            res.status(500).json({ message: 'Error updating user', error: error.message });
        }
    }
);

/**
 * @route   GET /list/:userId
 * @desc    Get all users except the current user (protected)
 * @access  Public
 */
router.get('/list/:userId', async (req, res) => {
    const { userId } = req.params;
    logger.info('Fetching all users except for user', { userId });
    try {
        const users = await User.find({ _id: { $ne: userId } }).select('-password');
        logger.info('Get Users List: Retrieved users excluding user', { userId });
        res.status(200).json(users);
    } catch (error) {
        logger.error('Get Users List: Error fetching users', { error: error.message });
        return res.status(500).json({ message: 'Server error: ' + error.message });
    }
});

/**
 * @route   GET /
 * @desc    Get all users (protected)
 * @access  Private
 */
router.get('/', authenticate, async (_, res) => {
    logger.info('Fetching all users');
    try {
        const users = await User.find().select('-password');
        logger.info('Get All Users: Retrieved all users successfully');
        res.status(200).json(users);
    } catch (error) {
        logger.error('Get All Users: Error fetching users', { error: error.message });
        return res.status(500).json({ message: 'Server error: ' + error.message });
    }
});

/**
 * @route   DELETE /:userId
 * @desc    Delete user by ID (protected)
 * @access  Private
 */
router.delete('/:userId', authenticate, async (req, res) => {
    const { userId } = req.params;
    logger.info('Deleting user', { userId });
    try {
        const user = await User.findById(userId);
        if (!user) {
            logger.error('Delete User: User not found', { userId });
            return res.status(404).json({ message: 'User not found' });
        }
        await user.deleteOne();
        logger.info('Delete User: User deleted successfully', { userId });
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        logger.error('Delete User: Error deleting user', { error: error.message });
        return res.status(500).json({ message: 'Server error: ' + error.message });
    }
});

/**
 * @route   DELETE /email/:email
 * @desc    Delete user by email (protected)
 * @access  Private
 */
router.delete('/email/:email', authenticate, async (req, res) => {
    const { email } = req.params;
    logger.info('Deleting user', { email });
    try {
        const user = await User.findOne({ email });
        if (!user) {
            logger.error('Delete User: User not found', { email });
            return res.status(404).json({ message: 'User not found' });
        }
        await user.deleteOne();
        logger.info('Delete User: User deleted successfully', { email });
        return res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        logger.error('Delete User: Error deleting user', { error: error.message });
        return res.status(500).json({ message: 'Server error: ' + error.message });
    }
});

/**
 * @route   PUT /:userId/status
 * @desc    Update user status (protected)
 * @access  Private
 */
router.put(
    '/:userId/status',
    authenticate,
    [body('status').isString().withMessage('Status must be a string')],
    async (req, res) => {
        const { userId } = req.params;
        const { status } = req.body;

        logger.info('Update Status: Attempting to update status', { userId });

        // Authorization Check: Only the user themselves or an admin can update the status
        if (String(req.user.userId) !== String(userId) && req.user.authLevel !== 'admin') {
            logger.warn('Update Status: Forbidden access attempt', { authUserId: req.user.userId, targetUserId: userId });
            return res.status(403).json({ message: 'Forbidden: You can only update your own status.' });
        }

        // Validation Check
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            logger.error('Update Status: Validation errors', { errors: errors.array() });
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const user = await User.findByIdAndUpdate(userId, { status }, { new: true });
            if (!user) {
                logger.error('Update Status: User not found', { userId });
                return res.status(404).json({ message: 'User not found' });
            }
            logger.info('Update Status: Status updated successfully', { userId });
            res.json(user);
        } catch (error) {
            logger.error('Update Status: Error updating user status', { error: error.message });
            res.status(500).json({ message: 'Error updating status', error: error.message });
        }
    }
);

/**
 * @route   POST /logout
 * @desc    Logout user and delete session (protected)
 * @access  Private
 */
router.post('/logout', authenticate, async (req, res) => {
    logger.info('Logging out user', { userId: req.user.userId });
    try {
        const endSession = await Session.findOneAndDelete({ user: req.user.userId });
        if (!endSession) {
            logger.error('Logout: No active session found', { userId: req.user.userId });
            return res.status(404).json({ message: 'No active session found' });
        }
        logger.info('Logout: Session ended successfully', { userId: req.user.userId });
        res.status(200).json({ message: 'Session ended: User logged out' });
    } catch (error) {
        logger.error('Logout: Error ending session', { error: error.message });
        res.status(500).json({ message: 'Error ending session', error: error.message });
    }
});

export default router;
