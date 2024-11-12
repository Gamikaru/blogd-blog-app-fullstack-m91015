// src/services/api/PostService.js

import logger from '@utils/logger';
import ApiClient from './ApiClient';

/**
 * Fetch all posts (with pagination)
 * @param {Object} params - Query parameters (e.g., { page: 1, limit: 10 })
 * @returns {Promise<Object>} Object containing posts and pagination info
 */
export const fetchAllPosts = async (params = {}) => {
    logger.info('Fetching all posts with params:', params);
    try {
        const response = await ApiClient.get('/post', { params });
        logger.info('Fetched all posts successfully');
        return response.data;
    } catch (error) {
        logger.error('Error fetching all posts:', error);
        throw error;
    }
};

/**
 * Fetch posts for a specific user by their ID (with pagination)
 * @param {String} userId - The ID of the user
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>} Object containing posts and pagination info
 */
export const fetchPostsByUser = async (userId, params = {}) => {
    logger.info('Fetching posts for user with ID:', userId);
    try {
        const response = await ApiClient.get(`/post/user/${userId}/posts`, { params });
        logger.info('Fetched posts for user successfully with ID:', userId);
        return response.data;
    } catch (error) {
        logger.error('Error fetching posts for user with ID:', userId, error);
        throw error;
    }
};

/**
 * Fetch a specific post by its ID
 * @param {String} postId - The ID of the post
 * @returns {Promise<Object>} The post object
 */
export const fetchPostById = async (postId) => {
    logger.info('Fetching post with ID:', postId);
    try {
        const response = await ApiClient.get(`/post/specific/${postId}`);
        logger.info('Fetched post successfully with ID:', postId);
        return response.data;
    } catch (error) {
        logger.error('Error fetching post with ID:', postId, error);
        throw error;
    }
};

/**
 * Create a new post
 * @param {FormData} formData - The form data containing post details and images
 * @returns {Promise<Object>} The created post object
 */
export const createPost = async (formData) => {
    logger.info('Creating a new post');
    try {
        const response = await ApiClient.post('/post', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        logger.info('Created post successfully:', response.data.post);
        return response.data.post;
    } catch (error) {
        logger.error('Error creating post:', error);
        throw error;
    }
};

/**
 * Update a post by its ID
 * @param {String} postId - The ID of the post to update
 * @param {FormData} formData - The form data containing updated post details and images
 * @returns {Promise<Object>} The updated post object
 */
export const updatePostById = async (postId, formData) => {
    logger.info('Updating post with ID:', postId);
    try {
        const response = await ApiClient.patch(`/post/${postId}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        logger.info('Updated post successfully with ID:', postId);
        return response.data.post;
    } catch (error) {
        logger.error('Error updating post with ID:', postId, error);
        throw error;
    }
};

/**
 * Delete a post by its ID
 * @param {String} postId - The ID of the post to delete
 * @returns {Promise<Object>} The response object
 */
export const deletePostById = async (postId) => {
    logger.info('Deleting post with ID:', postId);
    try {
        const response = await ApiClient.delete(`/post/${postId}`);
        logger.info('Deleted post successfully with ID:', postId);
        return response.data;
    } catch (error) {
        logger.error('Error deleting post with ID:', postId, error);
        throw error;
    }
};

/**
 * Like a post
 * @param {String} postId - The ID of the post to like
 * @returns {Promise<Object>} The updated post object
 */
export const likePost = async (postId) => {
    logger.info('Liking post with ID:', postId);
    try {
        const response = await ApiClient.put(`/post/like/${postId}`);
        logger.info('Liked post successfully with ID:', postId);
        return response.data;
    } catch (error) {
        logger.error('Error liking post with ID:', postId, error);
        throw error;
    }
};

/**
 * Unlike a post
 * @param {String} postId - The ID of the post to unlike
 * @returns {Promise<Object>} The updated post object
 */
export const unlikePost = async (postId) => {
    logger.info('Unliking post with ID:', postId);
    try {
        const response = await ApiClient.put(`/post/unlike/${postId}`);
        logger.info('Unliked post successfully with ID:', postId);
        return response.data;
    } catch (error) {
        logger.error('Error unliking post with ID:', postId, error);
        throw error;
    }
};

/**
 * Fetch top liked posts
 * @returns {Promise<Array>} Array of top liked post objects
 */
export const fetchTopLikedPosts = async () => {
    logger.info('Fetching top liked posts');
    try {
        const response = await ApiClient.get('/post/top-liked');
        logger.info('Fetched top liked posts successfully');
        return response.data;
    } catch (error) {
        logger.error('Error fetching top liked posts:', error);
        throw error;
    }
};
