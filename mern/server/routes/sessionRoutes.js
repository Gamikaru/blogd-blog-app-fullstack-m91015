import express from 'express';
import Session from '../models/sessionSchema.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { v4 as uuidv4 } from 'uuid';
import User from '../models/userSchema.js';

const router = express.Router();

// Create a new session for the given user - should be just /:user_id
router.post('/:id', authenticate, async (req, res) => {
    const userId = req.params.id;

    console.log('Creating session for user ID:', userId);  // Log before creating a session

    try {
        const newSession = new Session({
            sessionId: uuidv4(),
            user: userId
        });

        await newSession.save();
        console.log('Session created:', newSession);
        res.status(201).send(newSession);

    } catch (error) {
        console.error('Error creating session:', error);
        res.status(500).send('Error creating session');
    }
});

// Validate session token and return information about the associated user
router.get('/validate_token', authenticate, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).send('User not found');
        }
        res.status(200).json(user);
    } catch (error) {
        console.error('Error validating token:', error);
        res.status(500).send('Error validating token');
    }
});

// End a session
router.post('/end', authenticate, async (req, res) => {
    try {
        const endSession = await Session.findOneAndDelete({ user: req.user._id });
        console.log('Session ended:', endSession);
        res.status(200).send('Session ended');
    } catch (error) {
        console.error('Error ending session:', error);
        res.status(500).send('Error ending session');
    }
});

export default router;