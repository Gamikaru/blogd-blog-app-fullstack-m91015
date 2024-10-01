import { formatDistanceToNow } from "date-fns";
import React, { useCallback, useEffect } from "react";
import { usePrivateModalContext, usePostContext, useNotificationContext } from "../../../contexts";
import { deletePostById } from "../../../services/api/PostService";
import Logger from "../../../utils/Logger";

const PostCard = ({ userPosts }) => {
   const { setPosts, setSelectedPost, refreshPosts } = usePostContext();
   const { togglePrivateModal } = usePrivateModalContext();
   const { showNotification, hideNotification } = useNotificationContext();

   // Sort posts by creation date, with the most recent first
   const sortedPosts = [...userPosts].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

   // Function to delete the post after confirmation
   const handleDeletePost = useCallback(async (postId) => {
      Logger.info('Attempting to delete post with ID:', postId);
      try {
         // Optimistically remove the post from UI
         setPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId));

         // API call to delete post
         await deletePostById(postId);
         Logger.info('Post deleted successfully with ID:', postId);

         // Refresh the post list after deletion
         refreshPosts();

         // Show a success notification for the deletion
         showNotification('Post deleted successfully!', 'success');  // Add this line

      } catch (error) {
         Logger.error("Error deleting post:", error);

         // Show an error notification if deletion fails
         showNotification('Failed to delete the post. Please try again.', 'error');
      }
   }, [setPosts, refreshPosts, showNotification, hideNotification]);


   // Handle delete confirmation logic
   const confirmDeletePost = useCallback((postId) => {
      Logger.info('Request to delete post with ID:', postId);

      // Show confirmation toast with 'Yes' or 'No' buttons
      showNotification(
         "Are you sure you want to delete this post?",
         'warning',
         false,
         () => handleDeletePost(postId),  // Confirm delete action
         hideNotification // Cancel action
      );
   }, [handleDeletePost, showNotification, hideNotification]);

   // Handle opening the edit post modal
   const handleEditPostModal = useCallback((post) => {
      if (post && post._id) {
         Logger.info('Attempting to edit post:', post);
         setSelectedPost(post);
         togglePrivateModal('editPost');
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
                                 onClick={() => confirmDeletePost(post._id)}
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
