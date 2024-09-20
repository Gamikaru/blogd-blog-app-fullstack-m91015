// src/PostContext.js
import { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { fetchPosts as fetchPostsService, createPost, likePost } from '../services/api/PostService';

// Create PostContext
const PostContext = createContext();

// Custom hook to use PostContext
export const usePostContext = () => useContext(PostContext);

// Provider component to wrap parts of the app that need post management
export const PostProvider = ({ children }) => {
   const [userPosts, setUserPosts] = useState([]);
   const [likeStatus, setLikeStatus] = useState({});

   // Memoize fetchPosts to prevent infinite re-renders
   const fetchPosts = useCallback(async (userId) => {
      try {
         const posts = await fetchPostsService(userId); // Use PostService's fetchPosts
         setUserPosts(posts);

         // Initialize like status for each post
         const likeStatuses = {};
         posts.forEach(post => (likeStatuses[post._id] = false));
         setLikeStatus(likeStatuses);
      } catch (error) {
         console.error('Error fetching posts:', error);
      }
   }, []);

   // Handle new post creation
   const handleNewPost = async (content) => {
      try {
         const newPost = await createPost(content); // Use PostService's createPost

         // Add the new post to the top of the userPosts
         setUserPosts((prevPosts) => [newPost, ...prevPosts]);
         setLikeStatus((prev) => ({ ...prev, [newPost._id]: false }));
      } catch (error) {
         console.error('Error creating post:', error);
      }
   };

   // Handle liking a post
   const handleLike = async (postId) => {
      try {
         const updatedPost = await likePost(postId); // Use PostService's likePost

         // Update the post with the new like count
         setUserPosts(prevPosts =>
            prevPosts.map(post => (post._id === postId ? updatedPost : post))
         );
         setLikeStatus(prev => ({ ...prev, [postId]: true }));
      } catch (error) {
         console.error('Error liking post:', error);
      }
   };

   return (
      <PostContext.Provider value={{ userPosts, likeStatus, fetchPosts, handleNewPost, handleLike }}>
         {children}
      </PostContext.Provider>
   );
};
