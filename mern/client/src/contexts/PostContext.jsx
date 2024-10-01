import { createContext, useCallback, useContext, useState } from 'react';
import { createPost, fetchPostsByUser, likePost, unlikePost, updatePostById } from '../services/api/PostService';
import Logger from '../utils/Logger'; // Import Logger for debugging

// Create PostContext
const PostContext = createContext();

// Custom hook to use PostContext
export const usePostContext = () => useContext(PostContext);

// Provider component to wrap parts of the app that need post management
export const PostProvider = ({ children }) => {
   const [posts, setPosts] = useState([]); // Store posts for the current user
   const [likeStatus, setLikeStatus] = useState({}); // Track like status for each post
   const [selectedPost, setSelectedPost] = useState(null); // Track selected post for editing
   const [postsFetched, setPostsFetched] = useState(false); // Track whether posts are fetched

   // Function to refresh posts (re-trigger fetch)
   const refreshPosts = useCallback(() => {
      Logger.info("Refreshing posts...");
      setPostsFetched(false); // Trigger re-fetching of posts
   }, []);

   // Function to fetch posts for a specific user
   const fetchPostsByUserHandler = useCallback(async (userId) => {
      if (!postsFetched) { // Only fetch if posts have not been fetched
         Logger.info('Fetching posts for user with ID:', userId);
         try {
            const userPosts = await fetchPostsByUser(userId); // Fetch posts for a specific user
            setPosts(userPosts);

            // Initialize like status for each post
            const likeStatuses = {};
            userPosts.forEach(post => (likeStatuses[post._id] = post.likesBy || []));
            setLikeStatus(likeStatuses);
            Logger.info('Fetched posts for user successfully with ID:', userId);
            setPostsFetched(true); // Mark posts as fetched
         } catch (error) {
            Logger.error('Error fetching user posts with ID:', userId, error);
         }
      }
   }, [postsFetched]);

   // Handle new post creation
   const handleNewPost = async (content) => {
      Logger.info('Creating a new post with content:', content);
      try {
         const newPost = await createPost(content); // Use PostService's createPost
         setPosts((prevPosts) => [newPost, ...prevPosts]); // Add new post at the top of the list
         setLikeStatus((prev) => ({ ...prev, [newPost._id]: [] })); // Initialize like status for the new post
         Logger.info('Created post successfully:', newPost);

         refreshPosts(); // Ensure the new post is reflected in UI
      } catch (error) {
         Logger.error('Error creating post:', error);
      }
   };

   // Handle liking a post
   const handleLike = async (postId, userId) => {
      Logger.info('Liking post with ID:', postId, 'by user with ID:', userId);
      try {
         await likePost(postId); // Send the like request
         const updatedPosts = posts.map(post =>
            post._id === postId
               ? { ...post, likes: post.likes + 1, likesBy: [...post.likesBy, userId] }
               : post
         );
         setPosts(updatedPosts); // Update the post with the new like count
         setLikeStatus((prev) => ({ ...prev, [postId]: [...prev[postId], userId] })); // Mark as liked by the user
         Logger.info('Liked post successfully with ID:', postId);
      } catch (error) {
         Logger.error('Error liking post with ID:', postId, error);
      }
   };

   // Handle unliking a post
   const handleUnlike = async (postId, userId) => {
      Logger.info('Unliking post with ID:', postId, 'by user with ID:', userId);
      try {
         await unlikePost(postId); // Send the unlike request
         const updatedPosts = posts.map(post =>
            post._id === postId
               ? { ...post, likes: post.likes - 1, likesBy: post.likesBy.filter((id) => id !== userId) }
               : post
         );
         setPosts(updatedPosts); // Update the post with the new like count
         setLikeStatus((prev) => ({ ...prev, [postId]: prev[postId].filter((id) => id !== userId) })); // Mark as unliked by the user
         Logger.info('Unliked post successfully with ID:', postId);
      } catch (error) {
         Logger.error('Error unliking post with ID:', postId, error);
      }
   };

   // Handle post editing
   const handleEditPost = async (postId, updatedContent) => {
      Logger.info('Editing post with ID:', postId, 'with content:', updatedContent);

      // Optimistically update the post before confirming with the server
      const prevPosts = [...posts]; // Make a copy of the posts array
      setPosts(prevPosts.map(post => post._id === postId ? { ...post, content: updatedContent } : post));

      try {
         const updatedPost = await updatePostById(postId, { content: updatedContent });
         Logger.info('Updated post received from server:', updatedPost);

         if (!updatedPost || !updatedPost._id || !updatedPost.content || !updatedPost.userId) {
            throw new Error('Incomplete post data received from server.');
         }

         setPosts((prevPosts) =>
            prevPosts.map(post => post._id === postId ? { ...post, ...updatedPost } : post)
         );

         Logger.info('Edited post successfully with ID:', postId);
         refreshPosts(); // Ensure the updated post is reflected in UI
      } catch (error) {
         // Rollback changes in case of failure
         setPosts(prevPosts); // Rollback to previous state
         Logger.error('Error editing post with ID:', postId, error);
      }
   };

   return (
      <PostContext.Provider
         value={{
            posts,
            setPosts,
            likeStatus,
            fetchPostsByUserHandler,
            handleNewPost,
            handleLike,
            handleUnlike,
            handleEditPost,
            refreshPosts, // Provide refreshPosts function
            selectedPost, // Provide selectedPost to the context
            setSelectedPost // Allow setting the selected post
         }}
      >
         {children}
      </PostContext.Provider>
   );
};
