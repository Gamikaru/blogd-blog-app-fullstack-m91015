// routes/sessionRoutes.js

import express from 'express';
import { validateToken } from '../controllers/sessionController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * @route   GET /session/validate_token
 * @desc    Validate session token and return user info
 * @access  Private
 */
router.get('/validate_token', authenticate, validateToken);

export default router;