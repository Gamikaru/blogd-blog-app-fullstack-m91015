import React, { useEffect, useState } from "react";
import { Button, Card, Spinner } from "react-bootstrap";
import {
   FaBirthdayCake,
   FaBriefcase,
   FaEnvelope,
   FaMapMarkerAlt,
} from "react-icons/fa";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import ApiClient from "../ApiClient";
import { useUser } from "../UserContext";
import PostModal from "./PostModal";
import { usePostContext } from '../AppLayout'; // Import PostContext

// UserCard Component
const UserCard = ({
   userInitials,
   user,
   updateUserStatus,
   status,
   setStatus,
}) => {
   const formattedBirthdate = new Date(user.birthDate).toLocaleDateString(
      "en-US",
      {
         year: "numeric",
         month: "long",
         day: "numeric",
      }
   );

   const handleKeyDown = (e) => {
      if (e.key === "Enter") {
         e.preventDefault();
         updateUserStatus(status);
      }
   };

   return (
      <div className="user-card-container">
         <Card className="user-card">
            <div className="user-card-header">
               <div className="initials-title">{userInitials}</div>
               <input
                  type="text"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  onBlur={() => updateUserStatus(status)}
                  onKeyDown={handleKeyDown}
                  placeholder="Update Status"
               />
            </div>
            <Card.Body className="user-details">
               <div className="detail-item">
                  <FaEnvelope className="detail-icon" />
                  <span className="detail-text">{user.email}</span>
               </div>
               <div className="detail-item">
                  <FaBirthdayCake className="detail-icon" />
                  <span className="detail-text">{formattedBirthdate}</span>
               </div>
               <div className="detail-item">
                  <FaBriefcase className="detail-icon" />
                  <span className="detail-text">{user.occupation}</span>
               </div>
               <div className="detail-item">
                  <FaMapMarkerAlt className="detail-icon" />
                  <span className="detail-text">{user.location}</span>
               </div>
            </Card.Body>
         </Card>
      </div>
   );
};

// PostsCard Component
const PostsCard = ({ userPosts, handleLike, likeStatus }) => (
   <div className="home-post-card-container">
      <Card className="home-posts-card">
         <Card.Body>
            <Card.Title className="home-post-title">Your Recent Posts!</Card.Title>
            {userPosts.length > 0 ? (
               <div className="posts-scroll-container">
                  {userPosts.map((post) => (
                     <div key={post._id} className="post-container">
                        <div className="speech-bubble">
                           <p className="post-text">{post.content}</p>
                           <div className="like-info">
                              <FontAwesomeIcon icon={faHeart} className="like-icon" />
                              <span className="like-count">{post.likes}</span>
                           </div>
                        </div>
                        <div className="post-info">
                           <Button
                              className="like-button"
                              onClick={() => handleLike(post._id)}
                              disabled={likeStatus[post._id]}
                           >
                              Like
                           </Button>
                           <span className="post-date">
                              {post.createdAt
                                 ? new Date(post.createdAt).toLocaleDateString()
                                 : "Date Unavailable"}
                           </span>
                        </div>
                     </div>
                  ))}
               </div>
            ) : (
               <p>No posts available.</p>
            )}
         </Card.Body>
      </Card>
   </div>
);

// HomePage Component
export default function HomePage() {
   const { user, loading } = useUser();
   const { userPosts, handleNewPost } = usePostContext(); // Access posts and handler from PostContext
   const [likeStatus, setLikeStatus] = useState({});
   const [status, setStatus] = useState("");
   const [showModal, setShowModal] = useState(false); // Modal visibility state

   useEffect(() => {
      if (user && user._id) {
         setStatus(user.status);
         fetchPosts(); // Fetch posts when the component mounts
      }
   }, [user]);

   // Fetch user's posts
   const fetchPosts = async () => {
      try {
         const response = await ApiClient.get(`/post/user/${user._id}`);
         const data = response.data;

         // Initialize like status for each post
         const likeStatuses = {};
         data.forEach((post) => (likeStatuses[post._id] = false));

         setLikeStatus(likeStatuses); // Set like status for each post
      } catch (error) {
         console.error("Error fetching posts:", error);
      }
   };

   // Handle liking a post
   const handleLike = async (postId) => {
      try {
         const response = await ApiClient.put(`/post/like/${postId}`);
         const updatedPost = response.data;

         // Update the post with the new like count
         const updatedPosts = userPosts.map((post) =>
            post._id === postId ? updatedPost : post
         );

         setLikeStatus((prev) => ({ ...prev, [postId]: true })); // Mark this post as liked
      } catch (error) {
         console.error("Error liking post:", error);
      }
   };

   // Update user status
   const updateUserStatus = async (newStatus) => {
      try {
         await ApiClient.put(`/user/${user._id}/status`, { status: newStatus });
      } catch (error) {
         console.error("Error updating status:", error);
      }
   };

   if (loading) {
      return <Spinner animation="border" />;
   }

   if (!user || !user._id) {
      return <p>User data not available.</p>;
   }

   return (
      <div className="home-page-container">
         <div className="page-container">
            <div className="grid-container">
               <UserCard
                  userInitials={`${user.firstName.charAt(0)}${user.lastName.charAt(
                     0
                  )}`}
                  user={user}
                  updateUserStatus={updateUserStatus}
                  status={status}
                  setStatus={setStatus}
               />
               <PostsCard
                  userPosts={userPosts} // Use posts from PostContext
                  handleLike={handleLike}
                  likeStatus={likeStatus}
               />
               <PostModal
                  show={showModal}
                  handleClose={() => setShowModal(false)}
                  onPostSuccess={handleNewPost} // Use handleNewPost from PostContext
               />
            </div>
         </div>
      </div>
   );
}
