import ApiClient from './ApiClient';

// Fetch posts for a given user
export const fetchPosts = async (userId) => {
   try {
      const response = await ApiClient.get(`/post/${userId}`);
      return response.data;
   } catch (error) {
      console.error('Error fetching posts:', error);
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
