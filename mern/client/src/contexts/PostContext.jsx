// src/PostContext.js
import { createContext, useState, useContext, useCallback } from 'react';
import { fetchPostsByUser, createPost, likePost, unlikePost } from '../services/api/PostService';

// Create PostContext
const PostContext = createContext();

// Custom hook to use PostContext
export const usePostContext = () => useContext(PostContext);

// Provider component to wrap parts of the app that need post management
export const PostProvider = ({ children }) => {
   const [posts, setPosts] = useState([]); // Store posts for the current user
   const [likeStatus, setLikeStatus] = useState({}); // Track like status for each post

   // Function to fetch posts for a specific user
   const fetchPostsByUserHandler = useCallback(async (userId) => {
      try {
         const userPosts = await fetchPostsByUser(userId); // Fetch posts for a specific user
         setPosts(userPosts);
         // Initialize like status for each post
         const likeStatuses = {};
         userPosts.forEach(post => (likeStatuses[post._id] = post.likesBy || []));
         setLikeStatus(likeStatuses);
      } catch (error) {
         console.error('Error fetching user posts:', error);
      }
   }, []);

   // Handle new post creation
   const handleNewPost = async (content) => {
      try {
         const newPost = await createPost(content); // Use PostService's createPost
         setPosts((prevPosts) => [newPost, ...prevPosts]); // Add new post at the top of the list
         setLikeStatus((prev) => ({ ...prev, [newPost._id]: [] })); // Initialize like status for the new post
      } catch (error) {
         console.error('Error creating post:', error);
      }
   };

   // Handle liking a post
   const handleLike = async (postId, userId) => {
      try {
         await likePost(postId); // Send the like request
         const updatedPosts = posts.map(post =>
            post._id === postId
               ? { ...post, likes: post.likes + 1, likesBy: [...post.likesBy, userId] }
               : post
         );
         setPosts(updatedPosts); // Update the post with the new like count
         setLikeStatus((prev) => ({ ...prev, [postId]: [...prev[postId], userId] })); // Mark as liked by the user
      } catch (error) {
         console.error('Error liking post:', error);
      }
   };

   // Handle unliking a post
   const handleUnlike = async (postId, userId) => {
      try {
         await unlikePost(postId); // Send the unlike request
         const updatedPosts = posts.map(post =>
            post._id === postId
               ? { ...post, likes: post.likes - 1, likesBy: post.likesBy.filter((id) => id !== userId) }
               : post
         );
         setPosts(updatedPosts); // Update the post with the new like count
         setLikeStatus((prev) => ({ ...prev, [postId]: prev[postId].filter((id) => id !== userId) })); // Mark as unliked by the user
      } catch (error) {
         console.error('Error unliking post:', error);
      }
   };

   return (
      <PostContext.Provider
         value={{
            posts,
            likeStatus,
            fetchPostsByUserHandler,
            handleNewPost,
            handleLike,
            handleUnlike,
         }}
      >
         {children}
      </PostContext.Provider>
   );
};
