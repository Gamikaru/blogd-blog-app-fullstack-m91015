import express from 'express';
import Session from '../models/sessionSchema.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { v4 as uuidv4 } from 'uuid';


const router = express.Router();

// Create a new session
router.post('/start', authenticate, async (req, res) => {
    if (!req.user) {
        console.log('User not authenticated');
        return res.status(401).send('User not authenticated');
    }

    console.log('Creating session for user:', req.user);  // Log before creating a session

    try {
        const newSession = new Session({
            sessionId: uuidv4(),
            user: req.user._id
        });

        await newSession.save();
        console.log('Session created:', newSession);
        res.status(201).send(newSession);

    } catch (error) {
        console.error('Error creating session:', error);
        res.status(500).send('Error creating session');
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
}
);

export default router;