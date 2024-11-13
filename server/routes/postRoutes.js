// routes/postRoutes.js
import express from 'express';
import path from 'path';
import { uploadToCloudinary } from '../config/cloudinaryConfig.js'; // Correct import
import { authenticate } from '../middleware/authMiddleware.js';
import { sanitizePostContent } from '../middleware/sanitizeMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js'; // Removed processImages
import { validatePostCreation, validatePostUpdate } from '../middleware/validationMiddleware.js';
import Post from '../models/postSchema.js';
import logger from '../utils/logger.js';

const router = express.Router();

/**
 * @route   GET /top-liked
 * @desc    Get top 5 most liked posts or latest posts if none
 * @access  Public
 */
router.get('/top-liked', async (req, res) => {
    logger.info('Fetching top 5 most liked posts.');
    try {
        let posts = await Post.find({ likes: { $gt: 0 } })
            .sort({ likes: -1 })
            .limit(5)
            .select('title slug userId createdAt likes content imageUrls images')
            .populate('userId', 'firstName lastName')
            .lean({ virtuals: true }); // Include virtuals

        if (posts.length < 5) {
            const additionalPosts = await Post.find({ likes: 0 })
                .sort({ createdAt: -1 })
                .limit(5 - posts.length)
                .select('title slug userId createdAt likes content imageUrls images')
                .populate('userId', 'firstName lastName')
                .lean({ virtuals: true });
            posts = posts.concat(additionalPosts);
        }

        logger.info('Top liked posts fetched successfully.');
        res.status(200).json(posts);
    } catch (error) {
        logger.error('Error fetching top liked posts', { error: error.message });
        res.status(500).json({ error: 'Server error while fetching top liked posts.' });
    }
});

/**
 * @route   GET /user/:userId/posts
 * @desc    Get all posts by a specific user with pagination
 * @access  Private (Authentication required)
 */
router.get('/user/:userId/posts', authenticate, async (req, res) => {
    const { userId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    logger.info(`Fetching all posts for user ID: ${userId}`, { userId });

    try {
        const posts = await Post.find({ userId })
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(Number(limit))
            .select('title slug userId createdAt likes content imageUrls images')
            .populate('userId', 'firstName lastName')
            .lean({ virtuals: true });

        const totalPosts = await Post.countDocuments({ userId });

        logger.info(`Posts fetched successfully for user ID: ${userId}`, {
            userId,
            totalPosts,
        });
        res.status(200).json({
            totalPosts,
            currentPage: Number(page),
            totalPages: Math.ceil(totalPosts / limit),
            posts,
        });
    } catch (error) {
        logger.error('Error fetching user posts', { error: error.message, userId });
        res.status(500).json({ error: 'Server error while fetching user posts.' });
    }
});

/**
 * @route   GET /specific/:postId
 * @desc    Get a single post by ID
 * @access  Private (Authentication required)
 */
router.get('/specific/:postId', authenticate, async (req, res) => {
    const { postId } = req.params;
    logger.info('Fetching post', { postId });

    try {
        const post = await Post.findById(postId)
            .populate('userId', 'firstName lastName occupation aboutAuthor')
            .lean({ virtuals: true });

        if (!post) {
            logger.warn('Post not found', { postId });
            return res.status(404).json({ message: 'Post not found.' });
        }

        logger.info('Post fetched successfully', { postId });
        res.status(200).json(post);
    } catch (error) {
        logger.error('Error fetching post', { error: error.message, postId });
        res.status(500).json({ error: 'Server error while fetching the post.' });
    }
});

/**
 * @route   GET /
 * @desc    Get all posts with pagination
 * @access  Public
 */
router.get('/', async (req, res) => {
    logger.info('Fetching all posts.');
    const { page = 1, limit = 10 } = req.query;

    try {
        const posts = await Post.find()
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(Number(limit))
            .select('title slug userId createdAt likes content imageUrls images')
            .populate('userId', 'firstName lastName')
            .lean({ virtuals: true });

        const totalPosts = await Post.countDocuments();

        logger.info('All posts retrieved successfully.', { totalPosts });
        res.status(200).json({
            totalPosts,
            currentPage: Number(page),
            totalPages: Math.ceil(totalPosts / limit),
            posts,
        });
    } catch (error) {
        logger.error('Error retrieving posts', { error: error.message });
        res.status(500).json({ error: 'Server error while fetching posts.' });
    }
});

/**
 * @route   POST /
 * @desc    Create a new post
 * @access  Private (Authentication required)
 */
router.post(
    '/',
    authenticate,
    upload.array('images', 5), // Multer middleware to handle file uploads
    validatePostCreation,
    sanitizePostContent,
    async (req, res) => {
        const { title, content, category, imageUrls, tags, status, scheduledAt } = req.body;
        const { userId } = req.user;
        const files = req.files;

        logger.info('Creating a new post', { userId, title });

        try {
            let uploadedImageUrls = [];

            // Upload each image to Cloudinary with unique filenames
            if (files && files.length > 0) {
                uploadedImageUrls = await Promise.all(
                    files.map((file) => {
                        const uniqueFilename = `post_image_${Date.now()}_${file.originalname}`;
                        return uploadToCloudinary(file.buffer, uniqueFilename);
                    })
                );
            }

            // Combine any existing image URLs with the newly uploaded ones
            const finalImageUrls = imageUrls
                ? imageUrls.split(',').map((url) => url.trim()).concat(uploadedImageUrls)
                : uploadedImageUrls;

            const newPost = new Post({
                title,
                content,
                category,
                userId,
                likes: 0,
                views: 0,
                comments: [],
                imageUrls: finalImageUrls,
                tags: tags ? tags.split(',').map((tag) => tag.trim()) : [],
                status: status || 'draft',
                scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
            });

            await newPost.save();

            // Populate userId
            await newPost.populate('userId', 'firstName lastName occupation aboutAuthor');

            logger.info('Post created successfully', { postId: newPost._id });

            // Convert newPost to an object including virtuals
            const postObject = newPost.toObject({ virtuals: true });

            res.status(201).json({
                message: 'Post created successfully.',
                post: {
                    postId: postObject._id,
                    title: postObject.title,
                    slug: postObject.slug,
                    content: postObject.content,
                    category: postObject.category,
                    likes: postObject.likes,
                    views: postObject.views,
                    userId: postObject.userId, // Now populated
                    comments: postObject.comments,
                    imageUrls: postObject.imageUrls,
                    tags: postObject.tags,
                    status: postObject.status,
                    scheduledAt: postObject.scheduledAt,
                    createdAt: postObject.createdAt,
                    updatedAt: postObject.updatedAt,
                    excerpt: postObject.excerpt, // Include the virtual excerpt
                },
            });
        } catch (error) {
            logger.error('Error creating post', { error: error.message, userId });
            res.status(500).json({ message: 'Server error: ' + error.message });
        }
    }
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
    sanitizePostContent,
    async (req, res) => {
        const { postId } = req.params;
        const files = req.files;

        try {
            const post = await Post.findById(postId);
            if (!post) {
                logger.warn('Post not found for update', { postId });
                return res.status(404).json({ success: false, message: 'Post not found' });
            }

            // Before processing files
            logger.info('Starting to process image uploads', { postId, fileCount: files.length });

            // Handle image uploads
            if (files && files.length > 0) {
                try {
                    const uploadedImageUrls = await Promise.all(
                        files.map(async (file, index) => {
                            const timestamp = Date.now();
                            const extension = file.mimetype === 'image/webp' ? '.webp' : path.extname(file.originalname);
                            const filename = `post_${postId}_${timestamp}_${index}${extension}`;

                            // Inside the image upload loop
                            logger.info('Processing file:', { index, originalName: file.originalname });

                            logger.info('Uploading image', {
                                filename,
                                mimetype: file.mimetype,
                                size: file.size
                            });

                            const imageUrl = await uploadToCloudinary(file.buffer, filename);

                            // After uploading each image
                            logger.info('Uploaded image', { filename, url: imageUrl });

                            return imageUrl;
                        })
                    );


                 // After image(s) are uploaded, update the post's imageUrls
                    post.imageUrls = uploadedImageUrls;
                    logger.info('Images uploaded successfully', {
                        postId,
                        newImages: uploadedImageUrls.length,
                        totalImages: post.imageUrls.length
                    });
                } catch (uploadError) {
                    logger.error('Image upload failed', uploadError);
                    return res.status(500).json({
                        success: false,
                        message: 'Failed to upload images'
                    });
                }
            }

            // Update other fields
            if (req.body.title) post.title = req.body.title;
            if (req.body.content) post.content = req.body.content;
            if (req.body.category) post.category = req.body.category;
            if (req.body.imageUrls) {
                const newUrls = req.body.imageUrls.split(',').map(url => url.trim()).filter(Boolean);
                post.imageUrls = [...(post.imageUrls || []), ...newUrls];
            }
            if (req.body.tags) post.tags = req.body.tags;
            if (req.body.status) post.status = req.body.status;
            if (req.body.scheduledAt) post.scheduledAt = new Date(req.body.scheduledAt);

            // Before saving the post
            logger.info('Saving the updated post to the database', { postId });

            // Save the updated post
            await post.save();

            // After saving the post
            logger.info('Post saved successfully', { postId });

            // Return populated post data
            const updatedPost = await Post.findById(postId)
                .populate('userId', 'firstName lastName')
                .lean({ virtuals: true });

            // Before sending the response
            logger.info('Sending response to the client', { postId });

            logger.info('Post updated successfully', { postId });
            res.json({
                success: true,
                post: updatedPost,
                message: 'Post updated successfully'
            });
        } catch (error) {
            logger.error('Error updating post:', error);
            res.status(500).json({
                success: false,
                message: 'Server error: ' + error.message
            });
        }
    }
);

/**
 * @route   DELETE /:postId
 * @desc    Delete a post by ID
 * @access  Private (Authentication required)
 */
router.delete('/:postId', authenticate, async (req, res) => {
    const { postId } = req.params;
    logger.info('Deleting post', { postId, userId: req.user.userId });

    try {
        const post = await Post.findById(postId);
        if (!post) {
            logger.warn('Post not found for deletion', { postId });
            return res.status(404).json({ success: false, message: 'Post not found.' });
        }
        await post.deleteOne();
        logger.info('Post deleted successfully', { postId });
        res.status(200).json({ success: true, message: 'Post deleted successfully.' });
    } catch (error) {
        logger.error('Error deleting post', { error: error.message, postId });
        res.status(500).json({ success: false, message: 'Server error: ' + error.message });
    }
});

/**
 * @route   PUT /like/:postId
 * @desc    Like a post
 * @access  Private (Authentication required)
 */
router.put('/like/:postId', authenticate, async (req, res) => {
    const { postId } = req.params;
    const { userId } = req.user;
    logger.info('User liked post', { userId, postId });

    try {
        const post = await Post.findById(postId);
        if (!post) {
            logger.warn('Post not found for liking', { postId });
            return res.status(404).json({ message: 'Post not found.' });
        }
        if (post.likesBy && post.likesBy.includes(userId)) {
            logger.warn('User has already liked the post', { userId, postId });
            return res.status(400).json({ message: 'You have already liked this post.' });
        }
        post.likes += 1;
        post.likesBy = post.likesBy ? [...post.likesBy, userId] : [userId];
        await post.save();
        logger.info('Post liked successfully', { postId, userId });
        res.status(200).json({
            likes: post.likes,
            likesBy: post.likesBy,
            postId: post._id,
        });
    } catch (error) {
        logger.error('Error liking post', { error: error.message, userId, postId });
        res.status(500).json({ message: 'Server error: ' + error.message });
    }
});

/**
 * @route   PUT /unlike/:postId
 * @desc    Unlike a post
 * @access  Private (Authentication required)
 */
router.put('/unlike/:postId', authenticate, async (req, res) => {
    const { postId } = req.params;
    const { userId } = req.user;
    logger.info('User unliked post', { userId, postId });

    try {
        const post = await Post.findById(postId);
        if (!post) {
            logger.warn('Post not found for unliking', { postId });
            return res.status(404).json({ message: 'Post not found.' });
        }
        if (!post.likesBy || !post.likesBy.includes(userId)) {
            logger.warn('User has not liked the post yet', { userId, postId });
            return res.status(400).json({ message: 'You have not liked this post yet.' });
        }
        post.likes = Math.max(0, post.likes - 1);
        post.likesBy = post.likesBy.filter((id) => id.toString() !== userId.toString());
        await post.save();
        logger.info('Post unliked successfully', { postId, userId });
        res.status(200).json({
            likes: post.likes,
            likesBy: post.likesBy,
            postId: post._id,
        });
    } catch (error) {
        logger.error('Error unliking post', { error: error.message, userId, postId });
        res.status(500).json({ message: 'Server error: ' + error.message });
    }
});

export default router;