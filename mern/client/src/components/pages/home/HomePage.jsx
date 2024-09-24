import React, { lazy, Suspense, useCallback, useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import { useNotificationContext, usePostContext, useUser } from "../../../contexts"; // Import contexts
import { likePost, unlikePost } from "../../../services/api/PostService"; // Import PostService for handling posts
import UserService from "../../../services/api/UserService"; // Import UserService for user-related API calls
import Logger from "../../../utils/Logger"; // Import Logger from utils barrel

// Lazy load components
const UserCard = lazy(() => import("./UserCard"));
const PostCard = lazy(() => import("./PostCard"));

const HomePage = () => {
   const { user, loading } = useUser();
   const { posts, fetchPostsByUserHandler, handleLike, handleUnlike, likeStatus } = usePostContext(); // Use fetchPostsByUserHandler for fetching user's posts
   const { showNotification } = useNotificationContext();
   const [status, setStatus] = useState("");
   const [error, setError] = useState(null); // Add error state

   useEffect(() => {
      if (user && user._id) {
         setStatus(user.status);
         fetchPostsByUserHandler(user._id).catch((err) => {
            setError("Error fetching user posts.");
            Logger.error("Error fetching user posts:", err);
         }); // Fetch user posts only
      }
   }, [user, fetchPostsByUserHandler]);

   // Handle liking a post with useCallback to prevent unnecessary re-renders
   const handleLikePost = useCallback(async (postId) => {
      try {
         await handleLike(postId, user._id); // Like the post using PostContext
         showNotification("Post liked successfully!", "success");
      } catch (error) {
         Logger.error("Error liking post:", error);
         showNotification("Error liking post. Please try again.", "error");
      }
   }, [showNotification, handleLike, user._id]);

   // Handle unliking a post with useCallback
   const handleUnlikePost = useCallback(async (postId) => {
      try {
         await handleUnlike(postId, user._id); // Unlike the post using PostContext
         showNotification("Post unliked successfully!", "success");
      } catch (error) {
         Logger.error("Error unliking post:", error);
         showNotification("Error unliking post. Please try again.", "error");
      }
   }, [showNotification, handleUnlike, user._id]);

   // Handle updating user status with useCallback
   const updateUserStatus = useCallback(async (newStatus) => {
      try {
         setStatus(newStatus); // Optimistically update the status locally
         await UserService.updateUserStatus(user._id, newStatus);
         showNotification("Status updated successfully!", "success");
      } catch (error) {
         Logger.error("Error updating status:", error);
         showNotification("Error updating status. Please try again.", "error");
      }
   }, [user._id, showNotification]);

   // Loading state
   if (loading) {
      return <Spinner animation="border" />;
   }

   // Error handling
   if (error) {
      return <p>{error}</p>;
   }

   // User not available state
   if (!user || !user._id) {
      return <p>User data not available.</p>;
   }

   return (
      <div className="home-page-container">
         <div className="page-container">
            <div className="grid-container">
               <Suspense fallback={<Spinner animation="border" />}>
                  <UserCard
                     userInitials={`${user.firstName.charAt(0)}${user.lastName.charAt(0)}`}
                     user={user}
                     updateUserStatus={updateUserStatus}
                     status={status}
                     setStatus={setStatus}
                  />
                  <PostCard
                     userPosts={posts} // Display the user's posts
                     handleLike={handleLikePost}
                     handleUnlike={handleUnlikePost}
                     likeStatus={likeStatus}
                  />
               </Suspense>
            </div>
         </div>
      </div>
   );
};

export default HomePage;
