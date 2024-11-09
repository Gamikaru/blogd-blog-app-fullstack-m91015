import { ApiClient, Logger, sanitizeContent } from '@components';

// Fetch all posts (for all users)
export const fetchAllPosts = async () => {
    Logger.info('Fetching all posts');
    try {
        const response = await ApiClient.get(`/post`);
        Logger.info('Fetched all posts successfully');
        const sanitizedPosts = response.data.map(post => ({
            ...post,
            content: sanitizeContent(post.content)
        }));
        return sanitizedPosts;
    } catch (error) {
        Logger.error('Error fetching all posts:', error);
        throw error;
    }
};

// Fetch posts for a specific user by their ID
export const fetchPostsByUser = async (userId) => {
    Logger.info('Fetching posts for user with ID:', userId);
    try {
        const response = await ApiClient.get(`/post/user/${userId}`);
        Logger.info('Fetched posts for user successfully with ID:', userId);
        const sanitizedPosts = response.data.map(post => ({
            ...post,
            content: sanitizeContent(post.content)
        }));
        return sanitizedPosts;
    } catch (error) {
        Logger.error('Error fetching posts for user with ID:', userId, error);
        throw error;
    }
};

// Fetch a specific post by its ID
export const fetchPostById = async (postId) => {
    Logger.info('Fetching post with ID:', postId);
    try {
        const response = await ApiClient.get(`/post/specific/${postId}`);
        Logger.info('Fetched post successfully with ID:', postId);
        const sanitizedPost = {
            ...response.data,
            content: sanitizeContent(response.data.content)
        };
        return sanitizedPost;
    } catch (error) {
        Logger.error('Error fetching post with ID:', postId, error);
        throw error;
    }
};

// Create a new post
export const createPost = async (formData) => {
    Logger.info('Creating a new post');
    try {
        const response = await ApiClient.post(`/post`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        Logger.info('Created post successfully:', response.data.post);
        const sanitizedPost = {
            ...response.data.post,
            content: sanitizeContent(response.data.post.content)
        };
        return sanitizedPost; // Return the created post object
    } catch (error) {
        Logger.error('Error creating post:', error);
        throw error;
    }
};

// Update a post by its ID
export const updatePostById = async (postId, formData) => {
    Logger.info('Updating post with ID:', postId, 'with updated content:', formData);

    try {
        // Send the updated content as a payload (ensure structure matches backend expectations)
        const response = await ApiClient.patch(`/post/${postId}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        Logger.info('Updated post successfully with ID:', postId);
        const sanitizedPost = {
            ...response.data,
            content: sanitizeContent(response.data.content)
        };
        return sanitizedPost; // Return the updated post data
    } catch (error) {
        Logger.error('Error updating post with ID:', postId, error);
        throw error;
    }
};

// Delete a post by its ID
export const deletePostById = async (postId) => {
    Logger.info('Deleting post with ID:', postId);
    try {
        const response = await ApiClient.delete(`/post/${postId}`);
        Logger.info('Deleted post successfully with ID:', postId);
        return response.data;
    } catch (error) {
        Logger.error('Error deleting post with ID:', postId, error);
        throw error;
    }
};

// Like a post
export const likePost = async (postId) => {
    Logger.info('Liking post with ID:', postId);
    try {
        const response = await ApiClient.put(`/post/like/${postId}`);
        Logger.info('Liked post successfully with ID:', postId);
        const sanitizedPost = {
            ...response.data,
            content: sanitizeContent(response.data.content)
        };
        return sanitizedPost; // Return the updated post object
    } catch (error) {
        Logger.error('Error liking post with ID:', postId, error);
        throw error;
    }
};

// Unlike a post
export const unlikePost = async (postId) => {
    Logger.info('Unliking post with ID:', postId);
    try {
        const response = await ApiClient.put(`/post/unlike/${postId}`);
        Logger.info('Unliked post successfully with ID:', postId);
        const sanitizedPost = {
            ...response.data,
            content: sanitizeContent(response.data.content)
        };
        return sanitizedPost; // Return the updated post object
    } catch (error) {
        Logger.error('Error unliking post with ID:', postId, error);
        throw error;
    }
};

// Fetch top 5 most liked posts
export const fetchTopLikedPosts = async () => {
    Logger.info('Fetching top 5 most liked posts');
    try {
        const response = await ApiClient.get('/post/top-liked');
        Logger.info('Fetched top liked posts successfully');
        const sanitizedPosts = response.data.map(post => ({
            ...post,
            content: sanitizeContent(post.content)
        }));
        return sanitizedPosts;
    } catch (error) {
        Logger.error('Error fetching top liked posts:', error);
        throw error;
    }
};


