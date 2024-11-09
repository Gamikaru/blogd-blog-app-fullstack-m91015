import express from 'express';
import { authenticate } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js'; // Import the multer middleware
import Post from '../models/postSchema.js';

const router = express.Router();

/**
 * @route   POST /
 * @desc    Create a new post
 * @access  Private (Authentication required)
 */
router.post('/', authenticate, upload.array('images', 5), async (req, res) => {
    const { title, content, category, imageUrls, tags, status, scheduledAt } = req.body;
    const userId = req.user._id;
    const files = req.files;

    console.log('Creating a new post for user:', userId, 'with content:', content);

    // Validate content
    if (!content || content.length < 1) {
        console.log('Post creation failed: No content provided.');
        return res.status(400).send('Please enter some content to post');
    }

    try {
        const images = files.map(file => ({
            data: file.buffer.toString('base64'),
            isLink: false
        }));

        const newPost = new Post({
            title,
            content,
            category, // Add category to the new post
            userId,
            likes: 0,
            views: 0,
            comments: [],
            imageUrls: imageUrls ? imageUrls.split(',') : [],
            images,
            tags: tags ? tags.split(',') : [],
            status: status || 'draft',
            scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
            // timestamps created automatically by Mongoose
        });

        // Save the post to the database
        await newPost.save();
        console.log('Post created successfully:', newPost);

        // Send back all necessary fields
        return res.status(201).json({
            message: 'Post created successfully',
            post: {
                _id: newPost._id,
                title: newPost.title,
                slug: newPost.slug,
                content: newPost.content,
                category: newPost.category, // Include category in the response
                likes: newPost.likes,
                views: newPost.views,
                userId: newPost.userId,
                comments: newPost.comments,
                imageUrls: newPost.imageUrls,
                images: newPost.images,
                tags: newPost.tags,
                status: newPost.status,
                scheduledAt: newPost.scheduledAt,
                createdAt: newPost.createdAt,
                updatedAt: newPost.updatedAt
            }
        });
    } catch (error) {
        console.error('Error creating post:', error);
        return res.status(500).send('Server error: ' + error.message);
    }
});

/**
 * @route   GET /top-liked
 * @desc    Get top 5 most liked posts
 * @access  Public
 */
router.get('/top-liked', async (req, res) => {
    console.log('Fetching top 5 most liked posts.');
    try {
        let posts = await Post.find()
            .sort({ likes: -1 })
            .limit(5)
            .populate('userId', 'firstName lastName');

        if (posts.length === 0) {
            posts = await Post.find()
                .sort({ createdAt: -1 })
                .limit(5)
                .populate('userId', 'firstName lastName');
        }

        const formattedPosts = posts.map(post => {
            const doc = post.toObject();
            if (!doc.excerpt) {
                const words = post.content.split(' ').slice(0, 40).join(' ');
                doc.excerpt = words + (post.content.split(' ').length > 40 ? '...' : '');
            }
            return doc;
        });

        res.status(200).json(formattedPosts);
    } catch (error) {
        console.error('Error fetching top liked posts:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * @route   GET /:id
 * @desc    Get all posts by a specific user
 * @access  Private (Authentication required)
 */
router.get('/:id', authenticate, async (req, res) => {
    console.log(`Fetching posts for user ${req.params.id}`);
    try {
        const posts = await Post.find({ userId: req.params.id });
        console.log('Posts retrieved successfully:', posts);
        res.status(200).send(posts);
    } catch (error) {
        console.error('Error getting posts:', error);
        res.status(500).send('Server error: ' + error.message);
    }
});

/**
 * @route   GET /
 * @desc    Get all posts (sorted by timestamp)
 * @access  Private (Authentication required)
 */
// Fetch all posts with user details (firstName, lastName)
router.get('/', authenticate, async (req, res) => {
    console.log('Fetching all posts.');
    try {
        const posts = await Post.find()
            .populate('userId', 'firstName lastName')  // Populate user details
            .sort({ timeStamp: -1 });
        console.log('All posts retrieved successfully.');
        res.status(200).send(posts);
    } catch (error) {
        console.error('Error retrieving posts:', error);
        res.status(500).send('Server error: ' + error.message);
    }
});

/**
 * @route   GET /user/:id
 * @desc    Get all posts by a specific user
 * @access  Private (Authentication required)
 */
router.get('/user/:id', authenticate, async (req, res) => {
    console.log(`Fetching all posts for user ${req.params.id}`);
    try {
        const posts = await Post.find({ userId: req.params.id });
        console.log(`Posts by user ${req.params.id}:`, posts);
        res.status(200).send(posts);
    } catch (error) {
        console.error('Error getting posts:', error);
        res.status(500).send('Server error: ' + error.message);
    }
});

/**
 * @route   GET /specific/:id
 * @desc    Get a single post by ID
 * @access  Private (Authentication required)
 */
router.get('/specific/:id', authenticate, async (req, res) => {
    console.log('Fetching post with ID:', req.params.id);
    try {
        const post = await Post.findById(req.params.id).populate('userId', 'firstName lastName occupation aboutAuthor');
        if (!post) {
            console.log('Post not found with ID:', req.params.id);
            return res.status(404).send('Post not found');
        }
        console.log('Post fetched successfully:', post);
        res.status(200).send(post);
    } catch (error) {
        console.error('Error getting post:', error);
        res.status(500).send('Server error: ' + error.message);
    }
});

/**
 * @route   PATCH /:id
 * @desc    Update a post by ID
 * @access  Private (Authentication required)
 */
router.patch('/:id', authenticate, upload.array('images', 5), async (req, res) => {
    console.log('Updating post with ID:', req.params.id);
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            console.log('Post not found:', req.params.id);
            return res.status(404).json({ success: false, message: 'Post not found' });
        }

        const { title, content, category, imageUrls, tags, status, scheduledAt } = req.body;
        const files = req.files;

        post.title = title || post.title;
        post.content = content || post.content;
        post.category = category || post.category;
        post.imageUrls = imageUrls ? imageUrls.split(',') : post.imageUrls;
        post.tags = tags ? tags.split(',') : post.tags;
        post.status = status || post.status;
        post.scheduledAt = scheduledAt ? new Date(scheduledAt) : post.scheduledAt;

        if (files && files.length > 0) {
            const images = files.map(file => ({
                data: file.buffer.toString('base64'),
                isLink: false
            }));
            post.images = images;
        }

        // Add to edit history
        post.editHistory.push({
            editedAt: new Date(),
            content: post.content
        });

        await post.save();
        console.log('Post updated successfully:', post);

        // Return the updated post with all necessary fields
        return res.status(200).json({
            success: true,
            post: {
                _id: post._id,
                title: post.title,
                slug: post.slug,
                content: post.content,
                category: post.category,
                likes: post.likes,
                views: post.views,
                userId: post.userId,
                comments: post.comments,
                imageUrls: post.imageUrls,
                images: post.images,
                tags: post.tags,
                status: post.status,
                scheduledAt: post.scheduledAt,
                createdAt: post.createdAt,
                updatedAt: post.updatedAt
            }
        });
    } catch (error) {
        console.error('Error updating post:', error);
        return res.status(500).json({ success: false, message: 'Server error: ' + error.message });
    }
});

/**
 * @route   DELETE /:id
 * @desc    Delete a post by ID
 * @access  Private (Authentication required)
 */
router.delete('/:id', authenticate, async (req, res) => {
    console.log('Deleting post with ID:', req.params.id);
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            console.log('Post not found:', req.params.id);
            return res.status(404).json({ success: false, message: 'Post not found' });
        }

        await post.deleteOne();
        console.log('Post deleted successfully:', req.params.id);
        return res.status(200).json({ success: true, message: 'Post deleted successfully' }); // Return JSON instead of plain text
    } catch (error) {
        console.error('Error deleting post:', error);
        return res.status(500).json({ success: false, message: 'Server error: ' + error.message });
    }
});

/**
 * @route   PUT /like/:id
 * @desc    Like a post
 * @access  Private (Authentication required)
 */
router.put('/like/:id', authenticate, async (req, res) => {
    console.log('Liking post with ID:', req.params.id);
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            console.log('Post not found:', req.params.id);
            return res.status(404).send('Post not found');
        }

        post.likes += 1;
        await post.save();
        console.log('Post liked successfully:', post);
        res.status(200).json(post);
    } catch (error) {
        console.error('Error liking post:', error);
        return res.status(500).send('Server error: ' + error.message);
    }
});

/**
 * @route   PUT /unlike/:id
 * @desc    Unlike a post
 * @access  Private (Authentication required)
 */
router.put('/unlike/:id', authenticate, async (req, res) => {
    console.log('Unliking post with ID:', req.params.id);
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            console.log('Post not found:', req.params.id);
            return res.status(404).send('Post not found');
        }

        post.likes = Math.max(0, post.likes - 1); // Ensure likes don't go below 0
        await post.save();
        console.log('Post unliked successfully:', post);
        res.status(200).send('Post unliked successfully');
    } catch (error) {
        console.error('Error unliking post:', error);
        return res.status(500).send('Server error: ' + error.message);
    }
});


export default router;
