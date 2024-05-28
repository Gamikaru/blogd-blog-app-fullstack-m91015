// This file serves as the route handler for post-related requests.

import express from 'express';
import Post from '../models/postSchema.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

// Create a new post
router.post('/post-submit', authenticate, async (req, res) => {
    const { content } = req.body;
    const user_id = req.user._id; // Correct user_id extraction from req.user._id
    const likes = 0;
    const comments = [];
    const time_stamp = Date.now();

    if (!content) {
        console.log('No content provided');
        return res.status(400).send('Please enter some content to post');
    }

    try {
        const newPost = new Post({
            content,
            user_id,
            likes,
            comments,
            time_stamp
        });

        await newPost.save();
        console.log('Post created successfully');
        return res.status(201).send('Post created successfully');
    } catch (error) {
        console.error('Error during post creation:', error);
        return res.status(500).send('Server error: ' + error.message);
    }
});

// Get all posts by the current user
router.get('/posts/:id', authenticate, async (req, res) => {
    try {
        const posts = await Post.find({ user_id: req.params.id });
        console.log(`Posts by user ${req.params.id}:`, posts);
        res.send(posts);
    } catch (error) {
        console.error('Error getting posts:', error);
        res.status(500).send('Server error: ' + error.message);
    }
});

// Get a single post
router.get('/post-specific/:id', authenticate, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            console.log('Post not found');
            return res.status(404).send('Post not found');
        }
        console.log('Post:', post);
        res.send(post);
    } catch (error) {
        console.error('Error getting post:', error);
        res.status(500).send('Server error: ' + error.message);
    }
});

// Update a post
router.put('/post-edit/:id', authenticate, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            console.log('Post not found');
            return res.status(404).send('Post not found');
        }

        const fieldsToUpdate = req.body;
        Object.keys(fieldsToUpdate).forEach((field) => {
            post[field] = fieldsToUpdate[field];
        });

        await post.save();
        console.log('Post updated successfully');
        res.status(200).send('Post updated successfully');
    } catch (error) {
        console.error('Error updating post:', error);
        return res.status(500).send('Server error: ' + error.message);
    }
});

// Delete a post
router.delete('/post-delete/:id', authenticate, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            console.log('Post not found');
            return res.status(404).send('Post not found');
        }

        await post.deleteOne(); // Correct method to delete the document
        console.log('Post deleted successfully');
        res.status(200).send('Post deleted successfully');
    } catch (error) {
        console.error('Error deleting post:', error);
        return res.status(500).send('Server error: ' + error.message);
    }
});

// Like a post
router.put('/post-like/:id', authenticate, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            console.log('Post not found!');
            return res.status(404).send('Post not found');
        }

        post.likes += 1;
        await post.save();

        console.log('Post liked successfully');
        res.status(200).send('Post liked successfully');
    } catch (error) {
        console.error('Error liking post:', error);
        return res.status(500).send('Server error: ' + error.message);
    }
});

// Unlike a post
router.put('/post-unlike/:id', authenticate, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            console.log('Post not found');
            return res.status(404).send('Post not found');
        }

        post.likes -= 1;
        await post.save();

        console.log('Post unliked successfully');
        res.status(200).send('Post unliked successfully');
    } catch (error) {
        console.error('Error unliking post:', error);
        return res.status(500).send('Server error: ' + error.message);
    }
});




export default router;