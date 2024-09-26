import { formatDistanceToNow } from "date-fns";
import React, { useCallback, useEffect } from "react";
import { usePrivateModalContext, usePostContext } from "../../../contexts"; // Add necessary contexts
import { deletePostById } from "../../../services/api/PostService";
import Logger from "../../../utils/Logger";

const PostCard = ({ userPosts }) => {
   const { setPosts, setSelectedPost, refreshPosts } = usePostContext(); // Added refreshPosts
   const { togglePrivateModal } = usePrivateModalContext();

   // Sort posts by creation date, with the most recent first
   const sortedPosts = [...userPosts].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

   // Handle deleting a post
   const handleDeletePost = useCallback(async (postId) => {
      Logger.info('Attempting to delete post with ID:', postId);
      try {
         // Optimistic UI Update: Remove post locally before server confirmation
         setPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId));

         await deletePostById(postId); // Send delete request to server
         Logger.info('Post deleted successfully with ID:', postId);

         // Re-fetch posts to sync with the backend
         refreshPosts();
      } catch (error) {
         Logger.error("Error deleting post:", error);
      }
   }, [setPosts, refreshPosts]);

   // Handle opening the edit post modal
   const handleEditPostModal = useCallback((post) => {
      if (post && post._id) {
         Logger.info('Attempting to edit post:', post);
         setSelectedPost(post); // Set the selected post in the context
         togglePrivateModal('editPost'); // Open the modal
      } else {
         Logger.error('Attempted to edit post with invalid data');
      }
   }, [setSelectedPost, togglePrivateModal]);

   // Track re-render and updates
   useEffect(() => {
      Logger.info('PostCard re-rendered with posts:', userPosts);
   }, [userPosts]);

   return (
      <div className="home-post-card-container">
         <div className="home-posts-card">
            <div className="home-post-title">Your Recent Posts!</div>
            {sortedPosts.length > 0 ? (
               <div className="posts-scroll-container">
                  {sortedPosts.map((post) => (
                     <div key={post._id} className="post-container">
                        <div className="speech-bubble">
                           <p className="post-text">{post.content}</p>
                        </div>
                        <div className="post-info">
                           <span className="post-date">
                              {post.createdAt
                                 ? formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })
                                 : "Date Unavailable"}
                           </span>
                           <div className="action-buttons">
                              <button
                                 className="edit-button"
                                 onClick={() => handleEditPostModal(post)}
                              >
                                 Edit
                              </button>
                              <button
                                 className="delete-button"
                                 onClick={() => handleDeletePost(post._id)}
                              >
                                 Delete
                              </button>
                           </div>
                        </div>
                     </div>
                  ))}
               </div>
            ) : (
               <p className="no-posts-message">No posts available.</p>
            )}
         </div>
      </div>
   );
};

export default PostCard;
