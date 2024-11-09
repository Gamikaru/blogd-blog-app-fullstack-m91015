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
        const { content, postId } = req.body;
        const userId = req.user._id;

        if (!content || !postId) {
            return sendError(res, new Error('Validation Error'), 'Please provide all required fields', 400);
        }

        if (!mongoose.Types.ObjectId.isValid(postId)) {
            return sendError(res, new Error('Invalid postId'), 'The provided postId is not a valid ObjectId', 400);
        }

        const post = await Post.findById(postId);
        if (!post) {
            return sendError(res, new Error('Post Not Found'), 'No post found with the provided postId', 404);
        }

        const newComment = new Comment({
            content,
            postId,
            userId,
        });

        await newComment.save();
        return res.status(201).json({
            message: 'Comment created successfully',
            comment: {
                id: newComment._id,
                content: newComment.content,
                postId: newComment.postId,
                userId: newComment.userId,
                createdAt: newComment.createdAt
            }
        });
    } catch (error) {
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
        return res.status(200).json(comment);
    } catch (error) {
        sendError(res, error, 'Server error retrieving the comment');
    }
});

// Update a comment
router.patch('/:id', authenticate, async (req, res) => {
    const { content } = req.body;
    const userId = req.user._id;
    const { id } = req.params;

    if (!content) {
        return sendError(res, new Error('Validation Error'), 'Please enter some content to update', 400);
    }

    try {
        const comment = await Comment.findById(id);

        if (!comment) {
            return sendError(res, new Error('Comment Not Found'), 'Comment not found', 404);
        }

        if (comment.userId.toString() !== userId.toString()) {
            return sendError(res, new Error('Unauthorized'), 'Unauthorized user', 401);
        }

        comment.content = content;
        await comment.save();
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
    const userId = req.user._id;
    const { id } = req.params;

    try {
        const comment = await Comment.findById(id);

        if (!comment) {
            return sendError(res, new Error('Comment Not Found'), 'Comment not found', 404);
        }

        if (comment.userId.toString() !== userId.toString()) {
            return sendError(res, new Error('Unauthorized'), 'Unauthorized user', 401);
        }

        await comment.deleteOne();
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

// Reply to a comment
router.post('/reply/:id', authenticate, async (req, res) => {
    const { id } = req.params;
    const { content } = req.body;
    const userId = req.user._id;

    if (!content || content.length < 1) {
        return res.status(400).json({ success: false, message: 'Reply content is required' });
    }

    try {
        const parentComment = await Comment.findById(id);

        if (!parentComment) {
            return sendError(res, new Error('Comment Not Found'), 'Parent comment not found', 404);
        }

        const newComment = new Comment({
            content,
            userId,
            parentId: id,
            postId: parentComment.postId,
            likes: 0,
            replies: []
        });

        await newComment.save();

        parentComment.replies.push(newComment._id);
        await parentComment.save();

        return res.status(201).json({ success: true, comment: newComment });
    } catch (error) {
        sendError(res, error, 'Server error during reply creation');
    }
});

// Get a list of comments for a particular post
router.get('/comments/:post_id', authenticate, async (req, res) => {
    const { post_id } = req.params;

    try {
        const comments = await Comment.find({ postId: post_id }).sort({ createdAt: -1 });
        return res.status(200).json(comments);
    } catch (error) {
        sendError(res, error, 'Server error retrieving comments for the post');
    }
});

export default router;
