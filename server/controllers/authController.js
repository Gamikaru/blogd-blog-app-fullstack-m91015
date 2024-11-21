// controllers/authController.js

import bcrypt from 'bcrypt';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import { uploadToCloudinary } from '../config/cloudinaryConfig.js';
import Session from '../models/session.js';
import User from '../models/user.js';
import { sendResetPasswordEmail, sendVerificationEmail } from '../services/emailService.js';
import logger from '../utils/logger.js';
import sanitizeContent from '../utils/sanitizeContent.js';

dotenv.config();

/**
 * Register a new user with profile and cover photos.
 */
export const registerUser = async (req, res) => {
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
        let coverPictureUrl = '';

        // Handle profile picture upload
        if (req.files['profilePicture'] && req.files['profilePicture'][0]) {
            const profilePicture = req.files['profilePicture'][0];
            const profileFilename = `profile_${Date.now()}_${profilePicture.originalname}`;
            profilePictureUrl = await uploadToCloudinary(
                profilePicture.buffer,
                profileFilename,
                'blogd-users'
            );
        }

        // Handle cover photo upload
        if (req.files['coverPicture'] && req.files['coverPicture'][0]) {
            const coverPicture = req.files['coverPicture'][0];
            const coverFilename = `cover_${Date.now()}_${coverPicture.originalname}`;
            coverPictureUrl = await uploadToCloudinary(
                coverPicture.buffer,
                coverFilename,
                'blogd-users'
            );
        }

        // Sanitize input fields if necessary
        const sanitizedFirstName = sanitizeContent(firstName);
        const sanitizedLastName = sanitizeContent(lastName);
        const sanitizedLocation = sanitizeContent(location);
        const sanitizedOccupation = sanitizeContent(occupation);

        const user = new User({
            firstName: sanitizedFirstName,
            lastName: sanitizedLastName,
            birthDate,
            email: email.toLowerCase(),
            password,
            location: sanitizedLocation,
            occupation: sanitizedOccupation,
            authLevel: authLevel || 'basic',
            profilePicture: profilePictureUrl,
            coverPicture: coverPictureUrl,
        });

        if (process.env.ENABLE_EMAIL_VERIFICATION === 'true') {
            const token = crypto.randomBytes(32).toString('hex');
            user.verificationToken = token;
        } else {
            user.emailVerified = true; // Automatically verify email
        }

        await user.save();

        if (process.env.ENABLE_EMAIL_VERIFICATION === 'true') {
            await sendVerificationEmail(user, user.verificationToken);
            logger.info('User Registration: Verification email sent', { userId: user._id });
            res.status(201).json({
                message: 'User registered successfully. Please check your email to verify your account.',
            });
        } else {
            logger.info('User Registration: Email verification disabled, user registered successfully', { userId: user._id });
            res.status(201).json({
                message: 'User registered successfully.',
            });
        }
    } catch (error) {
        logger.error('User Registration: Error during registration', { error: error.message });
        res.status(500).json({ error: 'Server error during registration' });
    }
};

/**
 * Authenticate user and get token.
 */
export const loginUser = async (req, res) => {
    logger.info('User Login: Attempting login', { email: req.body.email });
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        logger.error('User Login: Validation errors', { errors: errors.array() });
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            logger.error('User Login: User not found', { email });
            return res.status(404).json({ message: 'No user found with this email.' });
        }

        if (process.env.ENABLE_EMAIL_VERIFICATION === 'true' && !user.emailVerified) {
            logger.warn('User Login: Email not verified', { userId: user._id });
            return res.status(401).json({ message: 'Email not verified. Please verify your email.' });
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

        // Create a new session
        const session = new Session({
            sessionId: crypto.randomUUID(),
            user: user._id,
            token,
        });
        await session.save();

        logger.info('User Login: Token generated successfully', { userId: user._id });

        // Prepare user data to send
        const userData = {
            userId: user._id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            // Add other necessary user fields as needed
        };

        res.status(200).json({ token, user: userData });
    } catch (error) {
        logger.error('User Login: Error during login', { error: error.message });
        return res.status(500).json({ message: 'Server error: ' + error.message });
    }
};

/**
 * Logout user and delete session.
 */
export const logoutUser = async (req, res) => {
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
};

/**
 * Send password reset email.
 */
export const forgotPassword = async (req, res) => {
    logger.info('Password Reset Request: Received email', { email: req.body.email });
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        logger.error('Password Reset Request: Validation errors', { errors: errors.array() });
        return res.status(400).json({ errors: errors.array() });
    }

    const { email } = req.body;

    try {
        const user = await User.findOne({ email: email.toLowerCase() });

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
};

/**
 * Reset user's password.
 */
export const resetPassword = async (req, res) => {
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
};