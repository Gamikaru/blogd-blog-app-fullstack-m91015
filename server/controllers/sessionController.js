// controllers/sessionController.js

import User from '../models/user.js';
import logger from '../utils/logger.js';

/**
 * Validate session token and return user info.
 */
export const validateToken = async (req, res) => {
    const { userId } = req.user;
    logger.info('Validating session token for user ID:', { userId });

    try {
        const user = await User.findById(userId);
        if (!user) {
            logger.error('Token Validation: User not found', { userId });
            return res.status(404).json({ message: 'User not found' });
        }

        logger.info('Token Validation: User validated successfully', { userId });
        res.status(200).json({
            userId: user._id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
        });
    } catch (error) {
        logger.error('Token Validation: Error validating token', { error: error.message, userId });
        res.status(500).json({ message: 'Server error: Unable to validate token' });
    }
};