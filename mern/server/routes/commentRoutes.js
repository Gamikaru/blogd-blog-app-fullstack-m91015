// This file serves as the route handler for comment-related requests. The code includes routes to create, update, and delete comments, as well as like and unlike comments. Error handling is included in each route to manage potential errors. All routes have thorough server and terminal logging to track request processing and error handling.
import express from 'express';
import { authenticate } from '../middleware/authMiddleware.js';
import Comment from '../models/commentSchema.js';

const router = express.Router();

// In commentRoutes.js
router.post('/comment-submit', authenticate, async (req, res) => {
    const { content, post_id } = req.body;
    const user_id = req.user._id;  // Ensure this is correctly populated

    if (!content || !post_id) {
        return res.status(400).send('Please provide all required fields');
    }

    try {
        const newComment = new Comment({
            content,
            post_id,
            user_id,
        });

        await newComment.save();
        return res.status(201).send('Comment created successfully');
    } catch (error) {
        console.error('Error during comment creation:', error);
        return res.status(500).send('Server error');
    }
});

router.put('/comment-edit/:comment_id', authenticate, async (req, res) => {
    const { content } = req.body;
    const { id: user_id } = req.user;
    const { comment_id } = req.params;

    if (!content) {
        console.log('No content provided');
        return res.status(400).send('Please enter some content to update');
    }

    try {
        const comment = await Comment.findById(comment_id);

        if (!comment) {
            console.log('Comment not found');
            return res.status(404).send('Comment not found');
        }

        if (comment.user_id.toString() !== user_id) {
            console.log('Unauthorized user');
            return res.status(401).send('Unauthorized user');
        }

        comment.content = content;
        await comment.save();
        console.log('Comment updated successfully');
        return res.status(200).send('Comment updated successfully');
    } catch (error) {
        console.error('Error during comment update:', error);
        return res.status(500).send('Server error: ' + error.message);
    }
});

// Delete a comment
router.delete('/comment-delete/:comment_id', authenticate, async (req, res) => {
    const { id: user_id } = req.user;
    const { comment_id } = req.params;  // Changed from id to comment_id

    try {
        const comment = await Comment.findById(comment_id);

        if (!comment) {
            console.log('Comment not found');
            return res.status(404).send('Comment not found');
        }

        if (comment.user_id.toString() !== user_id) {
            console.log('Unauthorized user');
            return res.status(401).send('Unauthorized user');
        }

        await comment.deleteOne();
        console.log('Comment deleted successfully');
        return res.status(200).send('Comment deleted successfully');
    } catch (error) {
        console.error('Error during comment deletion:', error);
        return res.status(500).send('Server error: ' + error.message);
    }
});

// Like a comment
router.put('/comment-like/:comment_id', authenticate, async (req, res) => {
    const { comment_id } = req.params;  // Changed from id to comment_id

    try {
        const result = await Comment.findByIdAndUpdate(comment_id, { $inc: { likes: 1 } }, { new: true });

        if (!result) {
            console.log('Comment not found');
            return res.status(404).send('Comment not found');
        }

        console.log('Comment liked successfully');
        return res.status(200).send('Comment liked successfully');
    } catch (error) {
        console.error('Error during comment like:', error);
        return res.status(500).send('Server error: ' + error.message);
    }
});

router.put('/comment-unlike/:comment_id', authenticate, async (req, res) => {
    const { comment_id } = req.params;  // Changed from id to comment_id

    try {
        const result = await Comment.findByIdAndUpdate(comment_id, { $inc: { likes: -1 } }, { new: true });

        if (!result) {
            console.log('Comment not found');
            return res.status(404).send('Comment not found');
        }

        console.log('Comment unliked successfully');
        return res.status(200).send('Comment unliked successfully');
    } catch (error) {
        console.error('Error during comment unlike:', error);
        return res.status(500).send('Server error: ' + error.message);
    }
});

// Get a list of comments for a particular post
router.get('/comments/:post_id', authenticate, async (req, res) => {
    const { post_id } = req.params;
    try {
        const comments = await Comment.find({ post_id }).sort({ time_stamp: -1 });
        console.log('Comments retrieved successfully');
        return res.status(200).send(comments);
    } catch (error) {
        console.error('Error retrieving comments:', error);
        return res.status(500).send('Server error: ' + error.message);

    }
});



export default router;