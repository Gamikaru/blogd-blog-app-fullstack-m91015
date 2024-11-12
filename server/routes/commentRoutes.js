// routes/commentRoutes.js

import express from 'express';
import mongoose from 'mongoose';
import { authenticate } from '../middleware/authMiddleware.js';
import Comment from '../models/commentSchema.js';
import Post from '../models/postSchema.js';

const router = express.Router();

// Helper function to handle errors
function sendError(res, error, message, statusCode = 500) {
    console.error(`${message}:`, error);
    res.status(statusCode).json({
        error: true,
        message,
        details: error.message || error,
    });
}

// Create a new comment
router.post('/', authenticate, async (req, res) => {
    console.log('Creating new comment with data:', req.body);
    try {
        const { content, postId } = req.body;
        const { userId } = req.user;

        if (!content || !postId) {
            console.error('Comment Creation: Missing required fields.');
            return sendError(res, new Error('Validation Error'), 'Please provide all required fields', 400);
        }

        if (!mongoose.Types.ObjectId.isValid(postId)) {
            console.error('Comment Creation: Invalid postId:', postId);
            return sendError(res, new Error('Invalid postId'), 'The provided postId is not a valid ObjectId', 400);
        }

        const post = await Post.findById(postId);
        if (!post) {
            console.error('Comment Creation: Post not found with ID:', postId);
            return sendError(res, new Error('Post Not Found'), 'No post found with the provided postId', 404);
        }

        const newComment = new Comment({
            content,
            postId,
            userId,
        });

        await newComment.save();
        console.log('Comment created successfully with ID:', newComment._id);
        return res.status(201).json({
            message: 'Comment created successfully',
            comment: {
                commentId: newComment._id,
                content: newComment.content,
                postId: newComment.postId,
                userId: newComment.userId,
                createdAt: newComment.createdAt,
            },
        });
    } catch (error) {
        sendError(res, error, 'Server error during comment creation');
    }
});

// Get a single comment
router.get('/:commentId', authenticate, async (req, res) => {
    const { commentId } = req.params;
    console.log('Fetching comment with ID:', commentId);
    try {
        const comment = await Comment.findById(commentId);
        if (!comment) {
            console.error('Comment not found with ID:', commentId);
            return sendError(res, new Error('Comment Not Found'), 'Comment not found', 404);
        }
        console.log('Comment fetched successfully with ID:', commentId);
        return res.status(200).json(comment);
    } catch (error) {
        sendError(res, error, 'Server error retrieving the comment');
    }
});

// Update a comment
router.patch('/:commentId', authenticate, async (req, res) => {
    const { content } = req.body;
    const { userId } = req.user;
    const { commentId } = req.params;

    console.log('Updating comment with ID:', commentId);
    if (!content) {
        console.error('Comment Update: No content provided.');
        return sendError(res, new Error('Validation Error'), 'Please enter some content to update', 400);
    }

    try {
        const comment = await Comment.findById(commentId);

        if (!comment) {
            console.error('Comment not found with ID:', commentId);
            return sendError(res, new Error('Comment Not Found'), 'Comment not found', 404);
        }

        if (comment.userId.toString() !== userId.toString()) {
            console.error('Unauthorized user ID:', userId, 'attempted to update comment ID:', commentId);
            return sendError(res, new Error('Unauthorized'), 'Unauthorized user', 401);
        }

        comment.content = content;
        await comment.save();
        console.log('Comment updated successfully with ID:', commentId);
        return res.status(200).json({
            message: 'Comment updated successfully',
            comment,
        });
    } catch (error) {
        sendError(res, error, 'Server error during comment update');
    }
});

// Delete a comment
router.delete('/:commentId', authenticate, async (req, res) => {
    const { userId } = req.user;
    const { commentId } = req.params;

    console.log('Deleting comment with ID:', commentId);
    try {
        const comment = await Comment.findById(commentId);

        if (!comment) {
            console.error('Comment not found with ID:', commentId);
            return sendError(res, new Error('Comment Not Found'), 'Comment not found', 404);
        }

        if (comment.userId.toString() !== userId.toString()) {
            console.error('Unauthorized user ID:', userId, 'attempted to delete comment ID:', commentId);
            return sendError(res, new Error('Unauthorized'), 'Unauthorized user', 401);
        }

        await comment.deleteOne();
        console.log('Comment deleted successfully with ID:', commentId);
        return res.status(200).json({ message: 'Comment deleted successfully' });
    } catch (error) {
        sendError(res, error, 'Server error during comment deletion');
    }
});

// Like a comment
router.put('/like/:commentId', authenticate, async (req, res) => {
    const { commentId } = req.params;
    console.log('Liking comment with ID:', commentId);

    try {
        const result = await Comment.findByIdAndUpdate(commentId, { $inc: { likes: 1 } }, { new: true });

        if (!result) {
            console.error('Comment not found with ID:', commentId);
            return sendError(res, new Error('Comment Not Found'), 'Comment not found', 404);
        }

        console.log('Comment liked successfully with ID:', commentId);
        return res.status(200).json({
            message: 'Comment liked successfully',
            likes: result.likes,
        });
    } catch (error) {
        sendError(res, error, 'Server error during comment like');
    }
});

// Unlike a comment
router.put('/unlike/:commentId', authenticate, async (req, res) => {
    const { commentId } = req.params;
    console.log('Unliking comment with ID:', commentId);

    try {
        const result = await Comment.findByIdAndUpdate(commentId, { $inc: { likes: -1 } }, { new: true });

        if (!result) {
            console.error('Comment not found with ID:', commentId);
            return sendError(res, new Error('Comment Not Found'), 'Comment not found', 404);
        }

        console.log('Comment unliked successfully with ID:', commentId);
        return res.status(200).json({
            message: 'Comment unliked successfully',
            likes: result.likes,
        });
    } catch (error) {
        sendError(res, error, 'Server error during comment unlike');
    }
});

// Reply to a comment
router.post('/reply/:commentId', authenticate, async (req, res) => {
    const { commentId } = req.params;
    const { content } = req.body;
    const { userId } = req.user;

    console.log('Replying to comment with ID:', commentId);
    if (!content || content.length < 1) {
        console.error('Reply Creation: No content provided.');
        return res.status(400).json({ success: false, message: 'Reply content is required' });
    }

    try {
        const parentComment = await Comment.findById(commentId);

        if (!parentComment) {
            console.error('Parent comment not found with ID:', commentId);
            return sendError(res, new Error('Comment Not Found'), 'Parent comment not found', 404);
        }

        const newComment = new Comment({
            content,
            userId,
            parentId: commentId,
            postId: parentComment.postId,
            likes: 0,
            replies: [],
        });

        await newComment.save();

        parentComment.replies.push(newComment._id);
        await parentComment.save();

        console.log('Reply created successfully with ID:', newComment._id);
        return res.status(201).json({ success: true, comment: newComment });
    } catch (error) {
        sendError(res, error, 'Server error during reply creation');
    }
});

// Get a list of comments for a particular post
router.get('/comments/:postId', authenticate, async (req, res) => {
    const { postId } = req.params;
    console.log('Fetching comments for post ID:', postId);

    try {
        const comments = await Comment.find({ postId }).sort({ createdAt: -1 });
        console.log('Comments fetched successfully for post ID:', postId);
        return res.status(200).json(comments);
    } catch (error) {
        sendError(res, error, 'Server error retrieving comments for the post');
    }
});

export default router;
