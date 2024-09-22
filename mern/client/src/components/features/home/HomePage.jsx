import React, { lazy, Suspense, useCallback, useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import { useNotificationContext, usePostContext, useUser } from "../../../contexts"; // Import contexts
import { likePost } from "../../../services/api/PostService"; // Import PostService for handling posts
import UserService from "../../../services/api/UserService"; // Import UserService for user-related API calls
import Logger from "../../../utils/Logger"; // Import Logger from utils barrel

// Lazy load components
const UserCard = lazy(() => import("./UserCard"));
const PostCard = lazy(() => import("./PostCard"));

const HomePage = () => {
   const { user, loading } = useUser();
   const { userPosts, fetchPosts } = usePostContext();
   const { showNotification } = useNotificationContext();
   const [likeStatus, setLikeStatus] = useState({});
   const [status, setStatus] = useState("");
   const [error, setError] = useState(null); // Add error state

   useEffect(() => {
      if (user && user._id) {
         setStatus(user.status);
         fetchPosts(user._id).catch((err) => {
            setError("Error fetching posts.");
            Logger.error("Error fetching posts:", err);
         }); // Handle errors gracefully
      }
   }, [user, fetchPosts]);

   // Handle liking a post with useCallback to prevent unnecessary re-renders
   const handleLikePost = useCallback(async (postId) => {
      try {
         setLikeStatus((prev) => ({ ...prev, [postId]: true })); // Optimistic update
         await likePost(postId); // Use PostService to like the post
         showNotification("Post liked successfully!", "success");
      } catch (error) {
         setLikeStatus((prev) => ({ ...prev, [postId]: false })); // Rollback on error
         Logger.error("Error liking post:", error);
         showNotification("Error liking post. Please try again.", "error");
      }
   }, [showNotification]);

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
                     userPosts={userPosts}
                     handleLike={handleLikePost}
                     likeStatus={likeStatus}
                  />
               </Suspense>
            </div>
         </div>
      </div>
   );
};

export default HomePage;
