import ApiClient from './ApiClient';

// Fetch all posts (for all users)
export const fetchAllPosts = async () => {
   try {
      const response = await ApiClient.get(`/post`);
      return response.data;
   } catch (error) {
      console.error('Error fetching all posts:', error);
      throw error;
   }
};

// Fetch posts for a specific user by their ID
export const fetchPostsByUser = async (userId) => {
   try {
      const response = await ApiClient.get(`/post/user/${userId}`);
      return response.data;
   } catch (error) {
      console.error('Error fetching posts for user:', error);
      throw error;
   }
};

// Fetch a specific post by its ID
export const fetchPostById = async (postId) => {
   try {
      const response = await ApiClient.get(`/post/specific/${postId}`);
      return response.data;
   } catch (error) {
      console.error('Error fetching post by ID:', error);
      throw error;
   }
};

// Create a new post
export const createPost = async (content) => {
   try {
      const response = await ApiClient.post(`/post`, { content });
      return response.data.post; // Return the created post object
   } catch (error) {
      console.error('Error creating post:', error);
      throw error;
   }
};

// Update a post by its ID
export const updatePostById = async (postId, updatedContent) => {
   try {
      const response = await ApiClient.patch(`/post/${postId}`, updatedContent);
      return response.data;
   } catch (error) {
      console.error('Error updating post:', error);
      throw error;
   }
};

// Delete a post by its ID
export const deletePostById = async (postId) => {
   try {
      const response = await ApiClient.delete(`/post/${postId}`);
      return response.data;
   } catch (error) {
      console.error('Error deleting post:', error);
      throw error;
   }
};

// Like a post
export const likePost = async (postId) => {
   try {
      const response = await ApiClient.put(`/post/like/${postId}`);
      return response.data; // Return the updated post object
   } catch (error) {
      console.error('Error liking post:', error);
      throw error;
   }
};

// Unlike a post
export const unlikePost = async (postId) => {
   try {
      const response = await ApiClient.put(`/post/unlike/${postId}`);
      return response.data; // Return the updated post object
   } catch (error) {
      console.error('Error unliking post:', error);
      throw error;
   }
};
