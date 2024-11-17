// controllers/userController.js
import dotenv from 'dotenv';
import { validationResult } from 'express-validator';
import { deleteFromCloudinary, uploadToCloudinary } from '../config/cloudinaryConfig.js';
import User from '../models/user.js';
import logger from '../utils/logger.js';
import sanitizeContent from '../utils/sanitizeContent.js';

dotenv.config();

/**
 * Register a new user with profile and cover photos.
 * (Moved to authController.js)
 */

/**
 * Verify user's email.
 */
export const verifyEmail = async (req, res) => {
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
};

/**
 * Get user by ID.
 */
export const getUserById = async (req, res) => {
    const { userId } = req.params;
    if (!userId) {
        logger.error('Get User: userId is undefined');
        return res.status(400).json({ message: 'User ID is required' });
    }
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
};

/**
 * Update user by ID with profile and cover photos.
 */
export const updateUser = async (req, res) => {
    const { userId } = req.params;
    const { authLevel, userId: authUserId } = req.user;

    if (String(authUserId) !== String(userId) && authLevel !== 'admin') {
        logger.warn('Update User: Forbidden access attempt', { authUserId, targetUserId: userId });
        return res.status(403).json({ message: 'Forbidden: You can only update your own profile.' });
    }

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
        ];
        allowedUpdates.forEach((field) => {
            if (fieldsToUpdate[field] !== undefined) {
                // Sanitize fields before updating
                if (['firstName', 'lastName', 'location', 'occupation', 'status'].includes(field)) {
                    user[field] = sanitizeContent(fieldsToUpdate[field]);
                } else {
                    user[field] = fieldsToUpdate[field];
                }
            }
        });

        // Safely handle profile picture upload
        if (req.files && req.files['profilePicture'] && req.files['profilePicture'][0]) {
            const profilePicture = req.files['profilePicture'][0];
            const profileFilename = `profile_${Date.now()}_${profilePicture.originalname}`;
            user.profilePicture = await uploadToCloudinary(
                profilePicture.buffer,
                profileFilename,
                'blogd-users'
            );
        }

        // Safely handle cover photo upload
        if (req.files && req.files['coverPicture'] && req.files['coverPicture'][0]) {
            const coverPicture = req.files['coverPicture'][0];
            const coverFilename = `cover_${Date.now()}_${coverPicture.originalname}`;
            user.coverPicture = await uploadToCloudinary(
                coverPicture.buffer,
                coverFilename,
                'blogd-users'
            );
        }

        await user.save(); // Save the updated user data
        logger.info('Update User: User updated successfully', { userId: user._id });
        res.status(200).json(user); // Send updated user back to front-end
    } catch (error) {
        logger.error('Update User: Error updating user', { error: error.message, userId });
        res.status(500).json({ message: 'Error updating user', error: error.message });
    }
};

/**
 * Get all users except the current user.
 */
export const listUsers = async (req, res) => {
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
};

/**
 * Get all users.
 */
export const getAllUsers = async (req, res) => {
    logger.info('Fetching all users');
    try {
        const users = await User.find().select('-password');
        logger.info('Get All Users: Retrieved all users successfully');
        res.status(200).json(users);
    } catch (error) {
        logger.error('Get All Users: Error fetching users', { error: error.message });
        return res.status(500).json({ message: 'Server error: ' + error.message });
    }
};

/**
 * Delete user by ID.
 */
export const deleteUserById = async (req, res) => {
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
};

/**
 * Delete user by email.
 */
export const deleteUserByEmail = async (req, res) => {
    const { email } = req.params;
    logger.info('Deleting user', { email });
    try {
        const user = await User.findOne({ email: email.toLowerCase() });
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
};

/**
 * Update user status.
 */
export const updateUserStatus = async (req, res) => {
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
        const sanitizedStatus = sanitizeContent(status);

        const user = await User.findByIdAndUpdate(userId, { status: sanitizedStatus }, { new: true });
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
};

/**
 * Delete user's profile picture.
 */
export const deleteProfilePicture = async (req, res) => {
    const { userId } = req.params;
    const { userId: authUserId, authLevel } = req.user;

    if (String(authUserId) !== String(userId) && authLevel !== 'admin') {
        logger.warn('Delete Profile Picture: Forbidden access attempt', { authUserId, targetUserId: userId });
        return res.status(403).json({ message: 'Forbidden: You can only delete your own profile picture.' });
    }

    try {
        const user = await User.findById(userId);

        if (!user) {
            logger.error('Delete Profile Picture: User not found', { userId });
            return res.status(404).json({ message: 'User not found' });
        }

        if (!user.profilePicture) {
            logger.info('Delete Profile Picture: No profile picture to delete', { userId });
            return res.status(400).json({ message: 'No profile picture to delete' });
        }

        // Delete the image from Cloudinary
        const result = await deleteFromCloudinary(user.profilePicture);
        logger.info('Delete Profile Picture: Cloudinary deletion result', { result });

        // Remove the profilePicture field from the user
        user.profilePicture = undefined;
        await user.save();

        logger.info('Delete Profile Picture: Profile picture deleted successfully', { userId });
        res.status(200).json({ message: 'Profile picture deleted successfully' });
    } catch (error) {
        logger.error('Delete Profile Picture: Error deleting profile picture', { error: error.message });
        res.status(500).json({ message: 'Error deleting profile picture', error: error.message });
    }
};