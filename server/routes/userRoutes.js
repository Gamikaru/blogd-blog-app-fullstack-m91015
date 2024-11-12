// routes/userRoutes.js

import bcrypt from 'bcrypt';
import crypto from 'crypto';
import dotenv from 'dotenv';
import express from 'express';
import { body, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import { authenticate } from '../middleware/authMiddleware.js';
import Session from '../models/sessionSchema.js';
import User from '../models/userSchema.js';
import { sendResetPasswordEmail, sendVerificationEmail } from '../services/emailService.js';

dotenv.config();

const router = express.Router();

/**
 * @route   POST /register
 * @desc    Register a new user
 * @access  Public
 */
router.post(
    '/register',
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
        console.log('User Registration: Received data:', req.body);
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.error('User Registration: Validation errors:', errors.array());
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
                console.error('User Registration: User already exists with email:', email);
                return res.status(400).json({ message: 'User with this email already exists.' });
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
            });
            const token = crypto.randomBytes(32).toString('hex');
            user.verificationToken = token;
            await user.save();

            await sendVerificationEmail(user, token);

            console.log('User Registration: User registered successfully with ID:', user._id);
            res.status(201).json({
                message: 'User registered successfully. Please check your email to verify your account.',
            });
        } catch (error) {
            console.error('User Registration: Error during registration:', error);
            res.status(500).json({ error: 'Server error during registration' });
        }
    }
);

// Verify email
router.get('/verify-email', async (req, res) => {
    const { token } = req.query;
    console.log('Email Verification: Received token:', token);

    try {
        const user = await User.findOne({ verificationToken: token });

        if (!user) {
            console.error('Email Verification: Invalid or expired token:', token);
            return res.status(400).json({ error: 'Invalid or expired token' });
        }

        user.emailVerified = true;
        user.verificationToken = undefined;
        await user.save();

        console.log('Email Verification: Email verified successfully for user ID:', user._id);
        res.status(200).json({ message: 'Email verified successfully' });
    } catch (error) {
        console.error('Email Verification: Error during email verification:', error);
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
        console.log('User Login: Received credentials:', { email: req.body.email });
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.error('User Login: Validation errors:', errors.array());
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;

        try {
            const user = await User.findOne({ email });
            if (!user) {
                console.error('User Login: User not found with email:', email);
                return res.status(404).json({ message: 'No user found with this email.' });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                console.error('User Login: Incorrect password for user ID:', user._id);
                return res.status(401).json({ message: 'Incorrect password for this user.' });
            }

            const token = jwt.sign(
                { userId: user._id, email: user.email, authLevel: user.authLevel },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );

            console.log('User Login: Token generated successfully for user ID:', user._id);
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
                },
                message: 'Login successful',
            });
        } catch (error) {
            console.error('User Login: Error during login:', error);
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
        console.log('Password Reset Request: Received email:', req.body.email);
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.error('Password Reset Request: Validation errors:', errors.array());
            return res.status(400).json({ errors: errors.array() });
        }

        const { email } = req.body;

        try {
            const user = await User.findOne({ email });

            if (!user) {
                console.error('Password Reset Request: User not found with email:', email);
                return res.status(404).json({ error: 'User not found' });
            }

            const token = crypto.randomBytes(32).toString('hex');
            user.resetPasswordToken = token;
            user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
            await user.save();

            await sendResetPasswordEmail(user, token);

            console.log('Password Reset Request: Password reset email sent to user ID:', user._id);
            res.status(200).json({ message: 'Password reset email sent' });
        } catch (error) {
            console.error('Password Reset Request: Error sending password reset email:', error);
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
        console.log('Password Reset: Received token:', req.body.token);
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.error('Password Reset: Validation errors:', errors.array());
            return res.status(400).json({ errors: errors.array() });
        }

        const { token, newPassword } = req.body;

        try {
            const user = await User.findOne({
                resetPasswordToken: token,
                resetPasswordExpires: { $gt: Date.now() },
            });

            if (!user) {
                console.error('Password Reset: Invalid or expired token:', token);
                return res.status(400).json({ error: 'Invalid or expired token' });
            }

            user.password = newPassword;
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;
            await user.save();

            console.log('Password Reset: Password reset successfully for user ID:', user._id);
            res.status(200).json({ message: 'Password reset successfully' });
        } catch (error) {
            console.error('Password Reset: Error resetting password:', error);
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
    console.log('Fetching user data for user ID:', userId);
    try {
        // Find user by ID and exclude password
        const user = await User.findById(userId).select('-password');
        if (!user) {
            console.error('Get User: User not found with ID:', userId);
            return res.status(404).json({ message: 'User not found' });
        }
        console.log('Get User: User data retrieved successfully for user ID:', userId);
        res.status(200).json(user);
    } catch (error) {
        console.error('Get User: Error fetching user:', error);
        return res.status(500).json({ message: 'Server error: ' + error.message });
    }
});

/**
 * @route   PATCH /:userId
 * @desc    Update user by ID (protected)
 * @access  Private
 */
router.patch(
    '/:userId',
    authenticate,
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

        console.log('Update User: Attempting to update user ID:', userId);

        // Authorization Check: Only the user themselves or an admin can update the profile
        if (String(authUserId) !== String(userId) && authLevel !== 'admin') {
            console.error('Update User: Forbidden - User ID:', authUserId, 'cannot update user ID:', userId);
            return res.status(403).json({ message: 'Forbidden: You can only update your own profile.' });
        }

        // Validation Check
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.error('Update User: Validation errors:', errors.array());
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const user = await User.findById(userId);
            if (!user) {
                console.error('Update User: User not found with ID:', userId);
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

            await user.save(); // Save the updated user data
            console.log('Update User: User updated successfully for user ID:', userId);
            res.status(200).json(user); // Send updated user back to front-end
        } catch (error) {
            console.error('Update User: Error updating user:', error);
            res.status(500).json({ message: 'Error updating user', error: error.message });
        }
    }
);

/**
 * @route   GET /list/:userId
 * @desc    Get all users except the current user (protected)
 * @access  Private
 */
router.get('/list/:userId', authenticate, async (req, res) => {
    const { userId } = req.params;
    console.log('Fetching all users except for user ID:', userId);
    try {
        const users = await User.find({ _id: { $ne: userId } }).select('-password');
        console.log('Get Users List: Retrieved users excluding user ID:', userId);
        res.status(200).json(users);
    } catch (error) {
        console.error('Get Users List: Error fetching users:', error);
        return res.status(500).json({ message: 'Server error: ' + error.message });
    }
});

/**
 * @route   GET /
 * @desc    Get all users (protected)
 * @access  Private
 */
router.get('/', authenticate, async (_, res) => {
    console.log('Fetching all users.');
    try {
        const users = await User.find().select('-password');
        console.log('Get All Users: Retrieved all users successfully.');
        res.status(200).json(users);
    } catch (error) {
        console.error('Get All Users: Error fetching users:', error);
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
    console.log('Deleting user with ID:', userId);
    try {
        const user = await User.findById(userId);
        if (!user) {
            console.error('Delete User: User not found with ID:', userId);
            return res.status(404).json({ message: 'User not found' });
        }
        await user.deleteOne();
        console.log('Delete User: User deleted successfully with ID:', userId);
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Delete User: Error deleting user:', error);
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
    console.log('Deleting user with email:', email);
    try {
        const user = await User.findOne({ email });
        if (!user) {
            console.error('Delete User: User not found with email:', email);
            return res.status(404).json({ message: 'User not found' });
        }
        await user.deleteOne();
        console.log('Delete User: User deleted successfully with email:', email);
        return res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Delete User: Error deleting user:', error);
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

        console.log('Update Status: Attempting to update status for user ID:', userId);

        // Authorization Check: Only the user themselves or an admin can update the status
        if (String(req.user.userId) !== String(userId) && req.user.authLevel !== 'admin') {
            console.error(
                'Update Status: Forbidden - User ID:',
                req.user.userId,
                'cannot update status for user ID:',
                userId
            );
            return res.status(403).json({ message: 'Forbidden: You can only update your own status.' });
        }

        // Validation Check
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.error('Update Status: Validation errors:', errors.array());
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const user = await User.findByIdAndUpdate(userId, { status }, { new: true });
            if (!user) {
                console.error('Update Status: User not found with ID:', userId);
                return res.status(404).json({ message: 'User not found' });
            }
            console.log('Update Status: Status updated successfully for user ID:', userId);
            res.json(user);
        } catch (error) {
            console.error('Update Status: Error updating user status:', error);
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
    console.log('Logging out user with ID:', req.user.userId);
    try {
        const endSession = await Session.findOneAndDelete({ user: req.user.userId });
        if (!endSession) {
            console.error('Logout: No active session found for user ID:', req.user.userId);
            return res.status(404).json({ message: 'No active session found' });
        }
        console.log('Logout: Session ended successfully for user ID:', req.user.userId);
        res.status(200).json({ message: 'Session ended: User logged out' });
    } catch (error) {
        console.error('Logout: Error ending session:', error);
        res.status(500).json({ message: 'Error ending session', error: error.message });
    }
});

export default router;
