// routes/sessionRoutes.js

import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { authenticate } from '../middleware/authMiddleware.js';
import Session from '../models/sessionSchema.js';
import User from '../models/userSchema.js';

const router = express.Router();

/**
 * @route   POST /:userId
 * @desc    Create a new session for a user
 * @access  Private (Authentication required)
 */
router.post('/:userId', authenticate, async (req, res) => {
    const { userId } = req.params;
    console.log('Creating session for user ID:', userId);

    try {
        // Check if a session already exists for the user
        const existingSession = await Session.findOne({ user: userId });
        if (existingSession) {
            console.error('Session Creation: User already has an active session:', existingSession);
            return res.status(409).json({ message: 'User already has an active session' });
        }

        const newSession = new Session({
            sessionId: uuidv4(),
            user: userId,
        });

        await newSession.save();
        console.log('Session Creation: Session created successfully for user ID:', userId);

        res.status(201).json(newSession);
    } catch (error) {
        console.error('Session Creation: Error creating session:', error);
        res.status(500).json({ message: 'Server error: Unable to create session' });
    }
});

/**
 * @route   GET /validate_token
 * @desc    Validate session token and return user info
 * @access  Private (Authentication required)
 */
router.get('/validate_token', authenticate, async (req, res) => {
    console.log('Validating session token for user ID:', req.user.userId);

    try {
        const user = await User.findById(req.user.userId);
        if (!user) {
            console.error('Token Validation: User not found for user ID:', req.user.userId);
            return res.status(404).json({ message: 'User not found' });
        }

        console.log('Token Validation: User validated successfully for user ID:', req.user.userId);
        res.status(200).json({
            userId: user._id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
        });
    } catch (error) {
        console.error('Token Validation: Error validating token:', error);
        res.status(500).json({ message: 'Server error: Unable to validate token' });
    }
});

/**
 * @route   POST /end
 * @desc    End a session
 * @access  Private (Authentication required)
 */
router.post('/end', authenticate, async (req, res) => {
    console.log('Ending session for user ID:', req.user.userId);

    try {
        // Find and delete the session for the authenticated user
        const endSession = await Session.findOneAndDelete({ user: req.user.userId });
        if (!endSession) {
            console.error('Session End: No session found for user ID:', req.user.userId);
            return res.status(404).json({ message: 'Session not found' });
        }

        console.log('Session End: Session ended successfully for user ID:', req.user.userId);
        res.status(200).json({ message: 'Session ended' });
    } catch (error) {
        console.error('Session End: Error ending session:', error);
        res.status(500).json({ message: 'Server error: Unable to end session' });
    }
});

export default router;
