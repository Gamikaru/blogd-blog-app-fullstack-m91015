import express from 'express';
import {
    createComment,
    deleteComment,
    getCommentById,
    getCommentsByPost,
    likeComment,
    replyToComment,
    unlikeComment,
    updateComment
} from '../controllers/commentController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { validateCreateComment } from '../validators/commentValidator.js'; // Corrected path

const router = express.Router();

/**
 * @route   POST /
 * @desc    Create a new comment
 * @access  Private
 */
router.post('/', authenticate, validateCreateComment, createComment);

/**
 * @route   GET /:commentId
 * @desc    Get a single comment by ID
 * @access  Private
 */
router.get('/:commentId', authenticate, getCommentById);

/**
 * @route   PATCH /:commentId
 * @desc    Update a comment by ID
 * @access  Private
 */
router.patch('/:commentId', authenticate, updateComment);

/**
 * @route   DELETE /:commentId
 * @desc    Delete a comment by ID
 * @access  Private
 */
router.delete('/:commentId', authenticate, deleteComment);

/**
 * @route   PUT /like/:commentId
 * @desc    Like a comment by ID
 * @access  Private
 */
router.put('/like/:commentId', authenticate, likeComment);

/**
 * @route   PUT /unlike/:commentId
 * @desc    Unlike a comment by ID
 * @access  Private
 */
router.put('/unlike/:commentId', authenticate, unlikeComment);

/**
 * @route   POST /reply/:commentId
 * @desc    Reply to a comment by parent comment ID
 * @access  Private
 */
router.post('/reply/:commentId', authenticate, replyToComment);

/**
 * @route   GET /comments/:postId
 * @desc    Get a list of comments for a particular post
 * @access  Private
 */
router.get('/comments/:postId', authenticate, getCommentsByPost);

export default router;