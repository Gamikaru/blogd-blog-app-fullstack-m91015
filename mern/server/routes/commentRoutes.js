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
        details: error.message || error
    });
}

// Create a new comment
router.post('/', authenticate, async (req, res) => {
    try {
        console.log('Headers:', req.headers);
        console.log('Body:', req.body);
        console.log('User:', req.user); // Ensure req.user is set

        const { content, post_id } = req.body;
        const user_id = req.user._id;

        console.log('Content:', content);
        console.log('Post ID:', post_id);
        console.log('User ID:', user_id);

        if (!content || !post_id) {
            return sendError(res, new Error('Validation Error'), 'Please provide all required fields', 400);
        }

        if (!mongoose.Types.ObjectId.isValid(post_id)) {
            return sendError(res, new Error('Invalid post_id'), 'The provided post_id is not a valid ObjectId', 400);
        }

        const post = await Post.findById(post_id);
        console.log('Post:', post); // Log the post

        if (!post) {
            return sendError(res, new Error('Post Not Found'), 'No post found with the provided post_id', 404);
        }

        const newComment = new Comment({
            content,
            post_id,
            user_id,
        });

        console.log('New Comment:', newComment); // Log the new comment

        await newComment.save();
        console.log('Comment saved successfully');
        return res.status(201).json({
            message: 'Comment created successfully',
            comment: {
                id: newComment._id,
                content: newComment.content,
                post_id: newComment.post_id,
                user_id: newComment.user_id,
                createdAt: newComment.createdAt
            }
        });
    } catch (error) {
        console.log('Error:', error); // Log the error
        sendError(res, error, 'Server error during comment creation');
    }
});


// Get a single comment
router.get('/:id', authenticate, async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);
        if (!comment) {
            return sendError(res, new Error('Comment Not Found'), 'Comment not found', 404);
        }
        console.log('Comment retrieved successfully:', comment);
        return res.status(200).json(comment);
    } catch (error) {
        sendError(res, error, 'Server error retrieving the comment');
    }
});

// Update a comment
router.patch('/:id', authenticate, async (req, res) => {
    const { content } = req.body;
    const user_id = req.user._id;
    const { id } = req.params;

    if (!content) {
        return sendError(res, new Error('Validation Error'), 'Please enter some content to update', 400);
    }

    try {
        const comment = await Comment.findById(id);

        if (!comment) {
            return sendError(res, new Error('Comment Not Found'), 'Comment not found', 404);
        }

        if (comment.user_id.toString() !== user_id.toString()) {
            return sendError(res, new Error('Unauthorized'), 'Unauthorized user', 401);
        }

        comment.content = content;
        await comment.save();
        console.log('Comment updated successfully:', comment);
        return res.status(200).json({
            message: 'Comment updated successfully',
            comment
        });
    } catch (error) {
        sendError(res, error, 'Server error during comment update');
    }
});

// Delete a comment
router.delete('/:id', authenticate, async (req, res) => {
    const user_id = req.user._id;
    const { id } = req.params;

    try {
        const comment = await Comment.findById(id);

        if (!comment) {
            return sendError(res, new Error('Comment Not Found'), 'Comment not found', 404);
        }

        if (comment.user_id.toString() !== user_id.toString()) {
            return sendError(res, new Error('Unauthorized'), 'Unauthorized user', 401);
        }

        await comment.deleteOne();
        console.log('Comment deleted successfully');
        return res.status(200).json({ message: 'Comment deleted successfully' });
    } catch (error) {
        sendError(res, error, 'Server error during comment deletion');
    }
});

// Like a comment
router.put('/like/:id', authenticate, async (req, res) => {
    const { id } = req.params;

    try {
        const result = await Comment.findByIdAndUpdate(id, { $inc: { likes: 1 } }, { new: true });

        if (!result) {
            return sendError(res, new Error('Comment Not Found'), 'Comment not found', 404);
        }

        console.log('Comment liked successfully');
        return res.status(200).json({
            message: 'Comment liked successfully',
            likes: result.likes
        });
    } catch (error) {
        sendError(res, error, 'Server error during comment like');
    }
});

// Unlike a comment
router.put('/unlike/:id', authenticate, async (req, res) => {
    const { id } = req.params;

    try {
        const result = await Comment.findByIdAndUpdate(id, { $inc: { likes: -1 } }, { new: true });

        if (!result) {
            return sendError(res, new Error('Comment Not Found'), 'Comment not found', 404);
        }

        console.log('Comment unliked successfully');
        return res.status(200).json({
            message: 'Comment unliked successfully',
            likes: result.likes
        });
    } catch (error) {
        sendError(res, error, 'Server error during comment unlike');
    }
});

// Get a list of comments for a particular post
router.get('/comments/:post_id', authenticate, async (req, res) => {
    const { post_id } = req.params;

    try {
        const comments = await Comment.find({ post_id }).sort({ time_stamp: -1 });
        console.log('Comments for post retrieved successfully');
        return res.status(200).json(comments);
    } catch (error) {
        sendError(res, error, 'Server error retrieving comments for the post');
    }
});

export default router;
