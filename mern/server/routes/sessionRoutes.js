import express from 'express';
import Session from '../models/sessionSchema.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { v4 as uuidv4 } from 'uuid';
import User from '../models/userSchema.js';

const router = express.Router();

/**
 * @route   POST /:id
 * @desc    Create a new session for a user
 * @access  Private (Authentication required)
 */
router.post('/:id', authenticate, async (req, res) => {
    const userId = req.params.id;
    console.log('Creating session for user ID:', userId);

    try {
        // Check if a session already exists for the user
        const existingSession = await Session.findOne({ user: userId });
        if (existingSession) {
            console.log('User already has an active session:', existingSession);
            return res.status(409).send('User already has an active session');
        }

        const newSession = new Session({
            sessionId: uuidv4(),
            user: userId
        });

        await newSession.save();
        console.log('Session created successfully:', newSession);

        res.status(201).json(newSession);
    } catch (error) {
        console.error('Error creating session:', error);
        res.status(500).send('Server error: Unable to create session');
    }
});

/**
 * @route   GET /validate_token
 * @desc    Validate session token and return user info
 * @access  Private (Authentication required)
 */
router.get('/validate_token', authenticate, async (req, res) => {
    console.log('Validating session token for user:', req.user._id);

    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            console.log('User not found for validation:', req.user._id);
            return res.status(404).send('User not found');
        }

        res.status(200).json({
            _id: user._id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName
        });
    } catch (error) {
        console.error('Error validating token:', error);
        res.status(500).send('Server error: Unable to validate token');
    }
});

/**
 * @route   POST /end
 * @desc    End a session
 * @access  Private (Authentication required)
 */
router.post('/end', authenticate, async (req, res) => {
    console.log('Ending session for user:', req.user._id);

    try {
        // Find and delete the session for the authenticated user
        const endSession = await Session.findOneAndDelete({ user: req.user._id });
        if (!endSession) {
            console.log('No session found for user:', req.user._id);
            return res.status(404).send('Session not found');
        }

        console.log('Session ended successfully:', endSession);
        res.status(200).send('Session ended');
    } catch (error) {
        console.error('Error ending session:', error);
        res.status(500).send('Server error: Unable to end session');
    }
});

export default router;
