import React, { lazy, Suspense, useEffect, useState } from "react";
import {Spinner} from "../../common"; // Import custom spinner component
import { useUser, usePostContext } from "../../../contexts";
import Logger from "../../../utils/Logger";

// Lazy load components
const UserCard = lazy(() => import("./UserCard"));
const PostCard = lazy(() => import("./PostCard"));

const HomePage = () => {
   const { user, loading } = useUser();
   const { posts, fetchPostsByUserHandler, refreshPosts } = usePostContext(); // Added refreshPosts
   const [error, setError] = useState(null);
   const [postsFetched, setPostsFetched] = useState(false); // Flag to track if posts have been fetched

   // Fetch user posts only once when the user is available
   useEffect(() => {
      if (user && user._id && !postsFetched) {
         Logger.info('Fetching posts for user:', user._id);
         fetchPostsByUserHandler(user._id)
            .then(() => setPostsFetched(true))
            .catch((err) => {
               setError("Error fetching user posts.");
               Logger.error("Error fetching user posts:", err);
            });
      }
   }, [user, fetchPostsByUserHandler, postsFetched]);

   // Re-fetch posts when refreshPosts is triggered
   useEffect(() => {
      if (postsFetched === false) {
         fetchPostsByUserHandler(user._id).then(() => setPostsFetched(true));
      }
   }, [postsFetched, fetchPostsByUserHandler, user._id]);

   // Show custom spinner when loading user data
   if (loading) {
      Logger.info('Loading user data...');
      return <Spinner message="Loading user data..." />;
   }

   // Error handling
   if (error) {
      Logger.error('Error encountered:', error);
      return <p>{error}</p>;
   }

   // User not available state
   if (!user || !user._id) {
      Logger.warn('User data not available.');
      return <p>User data not available.</p>;
   }

   Logger.info('Rendering HomePage component.');
   return (
      <div className="home-page-container">
         <div className="page-container">
            <div className="grid-container">
               <Suspense fallback={<Spinner message="Loading posts..." />}>
                  <UserCard user={user} />
                  <PostCard userPosts={posts} />
               </Suspense>
            </div>
         </div>
      </div>
   );
};

export default HomePage;
