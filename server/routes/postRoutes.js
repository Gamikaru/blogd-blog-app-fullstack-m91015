// routes/postRoutes.js

import express from 'express';
import {
    createPost,
    deletePost,
    getAllPosts,
    getPostById,
    getTopLikedPosts,
    getUserPosts,
    likePost,
    unlikePost,
    updatePost
} from '../controllers/postController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { sanitizeFields } from '../middleware/sanitizeMiddleware.js'; // Ensure this import exists
import { upload } from '../middleware/uploadMiddleware.js';
import { validatePostCreation, validatePostUpdate } from '../validators/postValidate.js';

const router = express.Router();

/**
 * @route   GET /top-liked
 * @desc    Get top 5 most liked posts or latest posts if none
 * @access  Public
 */
router.get('/top-liked', getTopLikedPosts);

/**
 * @route   GET /user/:userId/posts
 * @desc    Get all posts by a specific user with pagination
 * @access  Private (Authentication required)
 */
router.get('/user/:userId/posts', authenticate, getUserPosts);

/**
 * @route   GET /specific/:postId
 * @desc    Get a single post by ID
 * @access  Private (Authentication required)
 */
router.get('/specific/:postId', authenticate, getPostById);

/**
 * @route   GET /
 * @desc    Get all posts with pagination
 * @access  Public
 */
router.get('/', getAllPosts);

/**
 * @route   POST /
 * @desc    Create a new post
 * @access  Private (Authentication required)
 */
router.post(
    '/',
    authenticate,
    upload.array('images', 5),
    validatePostCreation,
    sanitizeFields('content'), // Applies sanitization before controller
    createPost
);

/**
 * @route   PATCH /:postId
 * @desc    Update a post by ID
 * @access  Private (Authentication required)
 */
router.patch(
    '/:postId',
    authenticate,
    upload.array('images', 5),
    validatePostUpdate,
    sanitizeFields('content'), // Applies sanitization before controller
    updatePost
);

/**
 * @route   DELETE /:postId
 * @desc    Delete a post by ID
 * @access  Private (Authentication required)
 */
router.delete('/:postId', authenticate, deletePost);

/**
 * @route   PUT /like/:postId
 * @desc    Like a post
 * @access  Private (Authentication required)
 */
router.put('/like/:postId', authenticate, likePost);

/**
 * @route   PUT /unlike/:postId
 * @desc    Unlike a post
 * @access  Private (Authentication required)
 */
router.put('/unlike/:postId', authenticate, unlikePost);

export default router;
