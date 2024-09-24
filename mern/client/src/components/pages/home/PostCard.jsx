import React from "react";
import { Card, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { formatDistanceToNow } from "date-fns";

const PostCard = ({ userPosts, handleLike, likeStatus }) => {
   const sortedPosts = [...userPosts].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

   return (
      <div className="home-post-card-container">
         <Card className="home-posts-card">
            <Card.Body>
               <Card.Title className="home-post-title">Your Recent Posts!</Card.Title>
               {sortedPosts.length > 0 ? (
                  <div className="posts-scroll-container">
                     {sortedPosts.map((post) => (
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
                                    ? formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })
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
};

export default PostCard;
