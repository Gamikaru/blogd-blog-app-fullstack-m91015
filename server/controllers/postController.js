// controllers/postController.js

import { deleteFromCloudinary, uploadToCloudinary } from '../config/cloudinaryConfig.js';

import Post from '../models/post.js';
import { extractPublicIdFromURL } from '../utils/imageHelpers.js';
import logger from '../utils/logger.js';

/**
 * Get top 5 most liked posts or latest posts if none.
 */
export const getTopLikedPosts = async (req, res) => {
    logger.info('Fetching top 5 most liked posts.');
    try {
        let posts = await Post.find({ likes: { $gt: 0 } })
            .sort({ likes: -1 })
            .limit(5)
            .select('title slug userId createdAt likes content imageUrls images')
            .populate('userId', 'firstName lastName')
            .lean({ virtuals: true });

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
};

/**
 * Get all posts by a specific user with pagination.
 */
export const getUserPosts = async (req, res) => {
    const { userId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    logger.info(`Fetching all posts for user ID: ${userId}`, { userId });

    try {
        const posts = await Post.find({ userId })
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(Number(limit))
            .select('title slug userId createdAt likes content imageUrls images category') // Ensure category is included
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
};

/**
 * Get a single post by ID.
 */
export const getPostById = async (req, res) => {
    const { postId } = req.params;
    logger.info('Fetching post', { postId });

    try {
        const post = await Post.findById(postId)
            .populate('userId', 'firstName lastName occupation aboutAuthor profilePicture')
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
};

/**
 * Get all posts with pagination.
 */
export const getAllPosts = async (req, res) => {
    logger.info('Fetching all posts.');
    const { page = 1, limit = 10 } = req.query;

    try {
        const posts = await Post.find()
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(Number(limit))
            .select('title slug userId createdAt likes content imageUrls images category') // Ensure category is included
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
};

/**
 * Create a new post.
 */
export const createPost = async (req, res) => {
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
                    return uploadToCloudinary(file.buffer, uniqueFilename, 'posts');
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
            tags: tags ? tags.map(tag => tag.trim()) : [],
            status: status || 'draft',
            scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
        });

        await newPost.save();

        // Populate userId
        await newPost.populate('userId', 'firstName lastName occupation aboutAuthor');

        logger.info('Post created successfully', { postId: newPost.postId });

        // Convert newPost to an object including virtuals
        const postObject = newPost.toObject({ virtuals: true });

        res.status(201).json({
            message: 'Post created successfully.',
            post: {
                postId: postObject.postId,
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
};

/**
 * Update a post by ID.
 */
export const updatePost = async (req, res) => {
    const { postId } = req.params;
    const files = req.files;
    const { title, content, category, imageUrls, tags, status, scheduledAt } = req.body;

    try {
        const post = await Post.findById(postId);
        if (!post) {
            logger.warn('Post not found', { postId });
            return res.status(404).json({ error: 'Post not found.' });
        }

        // If new images are uploaded, replace existing images
        if (files && files.length > 0) {
            logger.info('New images uploaded. Replacing existing images.', { postId, fileCount: files.length });

            // Delete existing images from Cloudinary
            if (post.imageUrls && post.imageUrls.length > 0) {
                for (const url of post.imageUrls) {
                    try {
                        const publicId = extractPublicIdFromURL(url);
                        await deleteFromCloudinary(publicId);
                        logger.info('Deleted image from Cloudinary', { publicId });
                    } catch (error) {
                        logger.error('Error deleting image from Cloudinary', { publicId, error: error.message });
                        // Optionally, continue deleting other images or handle the error accordingly
                    }
                }
            }

            // Upload new images to Cloudinary
            const uploadedImageUrls = [];
            for (const file of files) {
                try {
                    const result = await uploadToCloudinary(file.buffer, file.originalname, 'posts');
                    uploadedImageUrls.push(result);
                    logger.info('Uploaded image to Cloudinary', { url: result });
                } catch (error) {
                    logger.error('Error uploading image to Cloudinary', { file: file.originalname, error: error.message });
                    return res.status(500).json({ error: 'Failed to upload images.' });
                }
            }

            // Replace imageUrls with new uploads
            post.imageUrls = uploadedImageUrls;
        } else if (imageUrls) {
            // If no new images uploaded but imageUrls are provided, replace them
            const urlsArray = imageUrls.split(',').map(url => url.trim()).filter(url => url);
            post.imageUrls = urlsArray;
        }

        // Update other fields if provided
        if (title) post.title = title;
        if (content) {
            post.content = content;
            // Add to editHistory
            post.editHistory.push({ content });
        }
        if (category) post.category = category;
        if (tags) post.tags = tags.map(tag => tag.trim());
        if (status) post.status = status;
        if (scheduledAt) post.scheduledAt = new Date(scheduledAt);

        // Save the updated post
        await post.save();
        logger.info('Post updated successfully', { postId });

        // Populate userId
        await post.populate('userId', 'firstName lastName occupation aboutAuthor');

        // Convert to object including virtuals
        const postObject = post.toObject({ virtuals: true });

        res.status(200).json({
            message: 'Post updated successfully.',
            post: {
                postId: postObject.postId,
                title: postObject.title,
                slug: postObject.slug,
                content: postObject.content,
                category: postObject.category,
                likes: postObject.likes,
                views: postObject.views,
                userId: postObject.userId,
                comments: postObject.comments,
                imageUrls: postObject.imageUrls,
                tags: postObject.tags,
                status: postObject.status,
                scheduledAt: postObject.scheduledAt,
                createdAt: postObject.createdAt,
                updatedAt: postObject.updatedAt,
                excerpt: postObject.excerpt,
            },
        });
    } catch (error) {
        logger.error('Error updating post', { error: error.message, postId });
        res.status(500).json({ error: 'Server error while updating the post.' });
    }
};

/**
 * Delete a post by ID.
 */
export const deletePost = async (req, res) => {
    const { postId } = req.params;
    logger.info('Deleting post', { postId, userId: req.user.userId });

    try {
        const post = await Post.findById(postId);
        if (!post) {
            logger.warn('Post not found for deletion', { postId });
            return res.status(404).json({ success: false, message: 'Post not found.', postId });
        }
        await post.deleteOne();
        logger.info('Post deleted successfully', { postId });
        res.status(200).json({ success: true, message: 'Post deleted successfully.', postId });
    } catch (error) {
        logger.error('Error deleting post', { error: error.message, postId });
        res.status(500).json({ success: false, message: 'Server error: ' + error.message });
    }
};

/**
 * Like a post.
 */
export const likePost = async (req, res) => {
    const { postId } = req.params;
    const { userId } = req.user;
    logger.info('User liked post', { userId, postId });

    try {
        const post = await Post.findById(postId);
        if (!post) {
            logger.warn('Post not found for liking', { postId });
            return res.status(404).json({ message: 'Post not found.', postId });
        }
        if (post.likesBy && post.likesBy.includes(userId)) {
            logger.warn('User has already liked the post', { userId, postId });
            return res.status(400).json({ message: 'You have already liked this post.', postId });
        }
        post.likes += 1;
        post.likesBy = post.likesBy ? [...post.likesBy, userId] : [userId];
        await post.save();
        logger.info('Post liked successfully', { postId, userId });
        res.status(200).json({
            likes: post.likes,
            likesBy: post.likesBy,
            postId: post.postId,
        });
    } catch (error) {
        logger.error('Error liking post', { error: error.message, userId, postId });
        res.status(500).json({ message: 'Server error: ' + error.message });
    }
};

/**
 * Unlike a post.
 */
export const unlikePost = async (req, res) => {
    const { postId } = req.params;
    const { userId } = req.user;
    logger.info('User unliked post', { userId, postId });

    try {
        const post = await Post.findById(postId);
        if (!post) {
            logger.warn('Post not found for unliking', { postId });
            return res.status(404).json({ message: 'Post not found.', postId });
        }
        if (!post.likesBy || !post.likesBy.includes(userId)) {
            logger.warn('User has not liked the post yet', { userId, postId });
            return res.status(400).json({ message: 'You have not liked this post yet.', postId });
        }
        post.likes = Math.max(0, post.likes - 1);
        post.likesBy = post.likesBy.filter((id) => id.toString() !== userId.toString());
        await post.save();
        logger.info('Post unliked successfully', { postId, userId });
        res.status(200).json({
            likes: post.likes,
            likesBy: post.likesBy,
            postId: post.postId,
        });
    } catch (error) {
        logger.error('Error unliking post', { error: error.message, userId, postId });
        res.status(500).json({ message: 'Server error: ' + error.message });
    }
};