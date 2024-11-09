// routes/userRoutes.js

import bcrypt from 'bcrypt';
import crypto from 'crypto';
import dotenv from 'dotenv';
import express from 'express';
import { body, validationResult } from 'express-validator'; // Importing body and validationResult
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
router.post('/register',
    [
        body('firstName').notEmpty().withMessage('First Name is required'),
        body('lastName').notEmpty().withMessage('Last Name is required'),
        body('birthDate').isISO8601().toDate().withMessage('Valid Birth Date is required'),
        body('email').isEmail().withMessage('Valid Email is required'),
        body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
        body('location').notEmpty().withMessage('Location is required'),
        body('occupation').notEmpty().withMessage('Occupation is required'),
        body('authLevel').optional().isIn(['basic', 'admin']).withMessage('Invalid Auth Level')
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { firstName, lastName, birthDate, email, password, location, occupation, authLevel } = req.body;

        try {
            // Check if user already exists
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ message: 'User with this email already exists.' });
            }

            const user = new User({ firstName, lastName, birthDate, email, password, location, occupation, authLevel });
            const token = crypto.randomBytes(32).toString('hex');
            user.verificationToken = token;
            await user.save();

            await sendVerificationEmail(user, token);

            res.status(201).json({ message: 'User registered successfully. Please check your email to verify your account.' });
        } catch (error) {
            console.error('Error during registration:', error);
            res.status(500).json({ error: 'Server error during registration' });
        }
    }
);

// Verify email
router.get('/verify-email', async (req, res) => {
    const { token } = req.query;

    try {
        const user = await User.findOne({ verificationToken: token });

        if (!user) {
            return res.status(400).json({ error: 'Invalid or expired token' });
        }

        user.emailVerified = true;
        user.verificationToken = undefined;
        await user.save();

        res.status(200).json({ message: 'Email verified successfully' });
    } catch (error) {
        console.error('Error during email verification:', error);
        res.status(500).json({ error: 'Server error during email verification' });
    }
});

/**
 * @route   POST /login
 * @desc    Authenticate user and get token
 * @access  Public
 */
router.post('/login',
    [
        body('email').isEmail().withMessage('Valid Email is required'),
        body('password').notEmpty().withMessage('Password is required')
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;
        console.log('User Login: Received credentials:', { email });

        try {
            const user = await User.findOne({ email });
            if (!user) {
                console.log('User Login: User not found:', email);
                return res.status(404).json({ message: 'No user found with this email.' });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                console.log('User Login: Incorrect password.');
                return res.status(401).json({ message: 'Incorrect password for this user.' });
            }

            const token = jwt.sign(
                { _id: user._id, email: user.email, authLevel: user.authLevel },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );

            console.log('User Login: Token generated successfully.');
            res.status(200).json({
                token,
                user: {
                    _id: user._id,
                    email: user.email,
                    authLevel: user.authLevel,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    location: user.location,
                    occupation: user.occupation
                },
                message: 'Login successful'
            });
        } catch (error) {
            console.error("Error during login:", error);
            return res.status(500).json({ message: 'Server error: ' + error.message });
        }
    }
);

/**
 * @route   POST /forgot-password
 * @desc    Send password reset email
 * @access  Public
 */
router.post('/forgot-password',
    [
        body('email').isEmail().withMessage('Valid Email is required')
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email } = req.body;

        try {
            const user = await User.findOne({ email });

            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            const token = crypto.randomBytes(32).toString('hex');
            user.resetPasswordToken = token;
            user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
            await user.save();

            await sendResetPasswordEmail(user, token);

            res.status(200).json({ message: 'Password reset email sent' });
        } catch (error) {
            console.error('Error sending password reset email:', error);
            res.status(500).json({ error: 'Server error during password reset request' });
        }
    }
);

/**
 * @route   POST /reset-password
 * @desc    Reset password
 * @access  Public
 */
router.post('/reset-password',
    [
        body('token').notEmpty().withMessage('Token is required'),
        body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters')
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { token, newPassword } = req.body;

        try {
            const user = await User.findOne({
                resetPasswordToken: token,
                resetPasswordExpires: { $gt: Date.now() }
            });

            if (!user) {
                return res.status(400).json({ error: 'Invalid or expired token' });
            }

            user.password = newPassword;
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;
            await user.save();

            res.status(200).json({ message: 'Password reset successfully' });
        } catch (error) {
            console.error('Error resetting password:', error);
            res.status(500).json({ error: 'Server error during password reset' });
        }
    }
);

/**
 * @route   GET /:id
 * @desc    Get user by ID (protected)
 * @access  Private
 */
router.get('/:id', authenticate, async (req, res) => {
    console.log('Fetching user data for ID:', req.params.id);
    try {
        // Find user by ID and exclude password
        const user = await User.findById(req.params.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error("Error fetching user:", error);
        return res.status(500).json({ message: 'Server error: ' + error.message });
    }
});

/**
 * @route   PATCH /:id
 * @desc    Update user by ID (protected)
 * @access  Private
 */
router.patch('/:id',
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
        const { id } = req.params;
        const { authLevel, _id } = req.user; // Assuming authenticate middleware adds user info to req.user

        // Authorization Check: Only the user themselves or an admin can update the profile
        if (String(_id) !== String(id) && authLevel !== 'admin') {
            return res.status(403).json({ message: 'Forbidden: You can only update your own profile.' });
        }

        // Validation Check
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const user = await User.findById(id);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            // Update only allowed fields
            const fieldsToUpdate = req.body;
            const allowedUpdates = ['firstName', 'lastName', 'birthDate', 'email', 'location', 'occupation', 'authLevel', 'status', 'profilePicture'];
            Object.keys(fieldsToUpdate).forEach((field) => {
                if (allowedUpdates.includes(field)) {
                    user[field] = fieldsToUpdate[field];
                }
            });

            await user.save(); // Save the updated user data
            res.status(200).json(user); // Send updated user back to front-end
        } catch (error) {
            console.error('Error updating user:', error);
            res.status(500).json({ message: 'Error updating user', error: error.message });
        }
    }
);

/**
 * @route   GET /list/:id
 * @desc    Get all users except the current user (protected)
 * @access  Private
 */
router.get('/list/:id', authenticate, async (req, res) => {
    console.log('Fetching all users except for user ID:', req.params.id);
    try {
        const users = await User.find({ _id: { $ne: req.params.id } }).select('-password');
        res.status(200).json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        return res.status(500).json({ message: 'Server error: ' + error.message });
    }
});

/**
 * @route   GET /
 * @desc    Get all users (protected)
 * @access  Private
 */
router.get('/', authenticate, async (req, res) => {
    console.log('Fetching all users.');
    try {
        const users = await User.find().select('-password');
        res.status(200).json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        return res.status(500).json({ message: 'Server error: ' + error.message });
    }
});

/**
 * @route   DELETE /:id
 * @desc    Delete user by ID (protected)
 * @access  Private
 */
router.delete('/:id', authenticate, async (req, res) => {
    console.log('Deleting user with ID:', req.params.id);
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        await user.deleteOne();
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error("Error deleting user:", error);
        return res.status(500).json({ message: 'Server error: ' + error.message });
    }
});

/**
 * @route   DELETE /email/:email
 * @desc    Delete user by email (protected)
 * @access  Private
 */
router.delete('/email/:email', authenticate, async (req, res) => {
    console.log('Deleting user with email:', req.params.email);
    try {
        const user = await User.findOne({ email: req.params.email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        await user.deleteOne();
        return res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        return res.status(500).json({ message: 'Server error: ' + error.message });
    }
});

/**
 * @route   PUT /:id/status
 * @desc    Update user status (protected)
 * @access  Private
 */
router.put('/:id/status',
    authenticate,
    [
        body('status').isString().withMessage('Status must be a string')
    ],
    async (req, res) => {
        const { id } = req.params;
        const { status } = req.body;

        // Authorization Check: Only the user themselves or an admin can update the status
        if (String(req.user._id) !== String(id) && req.user.authLevel !== 'admin') {
            return res.status(403).json({ message: 'Forbidden: You can only update your own status.' });
        }

        // Validation Check
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        console.log('PUT request to update status for user ID:', id, 'with new status:', status); // Detailed logging

        try {
            const user = await User.findByIdAndUpdate(id, { status }, { new: true });
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.json(user);
        } catch (error) {
            console.error('Error updating user status:', error);
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
    console.log('Logging out user with ID:', req.user._id);
    try {
        const endSession = await Session.findOneAndDelete({ user: req.user._id });
        res.status(200).json({ message: 'Session ended: User logged out' });
    } catch (error) {
        console.error('Error ending session:', error);
        res.status(500).json({ message: 'Error ending session', error: error.message });
    }
});

export default router;
