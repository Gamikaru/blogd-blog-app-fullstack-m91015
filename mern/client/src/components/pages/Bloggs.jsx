import React, { useEffect, useState } from "react";
import { Button, Card, Container, Form, Spinner } from "react-bootstrap";
import { useCookies } from "react-cookie";
import { FaHeart } from "react-icons/fa";
import { fetchAllPosts, likePost, unlikePost } from "../../services/api/PostService"; // Updated service imports
import { useUser } from "../../contexts"; // Import useUser from contexts
import Logger from "../../utils/Logger"; // Import Logger

export default function BloggsPosts() {
   const [cookie] = useCookies();
   const { user } = useUser(); // Get the user from the UserContext
   const [blogPosts, setBlogPosts] = useState([]);
   const [commentTexts, setCommentTexts] = useState({});
   const [loading, setLoading] = useState(true);

   // Fetch all blog posts when the component mounts
   useEffect(() => {
      Logger.info("Component mounted, fetching all blog posts...");
      fetchAllBlogPosts(); // Fetch all posts (not just user's posts)
   }, []);

   // Fetch all blog posts
   const fetchAllBlogPosts = async () => {
      try {
         Logger.info("Fetching all blog posts...");
         const posts = await fetchAllPosts(); // Use the post service to fetch all posts
         Logger.info("All blog posts fetched:", posts);
         setBlogPosts(posts);
         setLoading(false);
      } catch (error) {
         Logger.error("Error fetching blog posts:", error);
         setLoading(false);
      }
   };

   // Handle like/unlike for a post
   const handleLike = async (postId) => {
      try {
         Logger.info(`Toggling like for post ID: ${postId}`);
         const post = blogPosts.find((post) => post._id === postId);
         const alreadyLiked = post.likesBy?.includes(cookie.userID);

         if (alreadyLiked) {
            await unlikePost(postId); // Unlike the post
         } else {
            await likePost(postId); // Like the post
         }

         const updatedPosts = blogPosts.map((prevPost) =>
            prevPost._id === postId
               ? {
                  ...prevPost,
                  likes: alreadyLiked ? prevPost.likes - 1 : prevPost.likes + 1,
                  likesBy: alreadyLiked
                     ? prevPost.likesBy.filter((userId) => userId !== cookie.userID)
                     : [...(prevPost.likesBy || []), cookie.userID],
               }
               : prevPost
         );

         Logger.info("Updated blog posts after like/unlike:", updatedPosts);
         setBlogPosts(updatedPosts);
      } catch (error) {
         Logger.error(`Error toggling like/unlike on post:`, error);
      }
   };

   // Handle comment text changes
   const handleCommentChange = (postId, commentText) => {
      Logger.info(`Comment text changed for post ID: ${postId}`, commentText);
      setCommentTexts((prevCommentTexts) => ({
         ...prevCommentTexts,
         [postId]: commentText,
      }));
   };

   // Handle submitting a new comment
   const handleCommentSubmit = async (postId) => {
      const commentText = commentTexts[postId];
      Logger.info(`Submitting comment for post ID: ${postId}`, commentText);
      try {
         const response = await ApiClient.post(`/comment`, {
            content: commentText,
            userId: cookie.userID,
            userName: `${user.first_name} ${user.last_name}`,
            postId,
         });

         const newComment = response.data;
         Logger.info("New comment added:", newComment);
         const updatedPosts = blogPosts.map((prevPost) =>
            prevPost._id === postId
               ? { ...prevPost, comments: [...prevPost.comments, newComment] }
               : prevPost
         );

         Logger.info("Updated blog posts after adding comment:", updatedPosts);
         setBlogPosts(updatedPosts);
         setCommentTexts((prevCommentTexts) => ({
            ...prevCommentTexts,
            [postId]: "",
         }));
      } catch (error) {
         Logger.error("Error adding comment:", error);
      }
   };

   // Function to fetch the author from the post data
   const author = (post) => {
      return post.userId ? `${post.userId.firstName} ${post.userId.lastName}` : "Unknown Author";
   };

   return (
      <Container>
         {loading ? (
            <div className="loading-spinner">
               <Spinner animation="border" variant="primary" />
            </div>
         ) : (
            <div className="grid-container blog-posts-grid">
               {blogPosts.length > 0 ? (
                  blogPosts.map((post) => (
                     <div className="grid-item bloggs-grid-item" key={post._id}>
                        <Card className="bloggs-post-section">
                           <Card.Body className="bloggs-body">
                              <Card.Title className="bloggs-card-title">
                                 <span className="username">{author(post)}</span>
                              </Card.Title>
                              <Card.Text className="speech-bubble">
                                 <span className="post-text">{post.content}</span>
                              </Card.Text>
                              <div className="post-interactions">
                                 <Button
                                    className="like-button"
                                    onClick={() => handleLike(post._id)}
                                    aria-label={post.likesBy?.includes(cookie.userID) ? "Unlike" : "Like"}
                                 >
                                    {post.likesBy?.includes(cookie.userID) ? "Unlike" : "Like"}
                                 </Button>
                                 <div className="like-section">
                                    <FaHeart className="heart-icon" />
                                    <span className="likes-count">{post.likes}</span>
                                 </div>
                                 <div className="date-section">
                                    {new Date(post.createdAt).toLocaleDateString()}
                                 </div>
                              </div>
                           </Card.Body>
                           <Card.Footer className="bloggs-card-footer">
                              <div className="bloggs-comments">
                                 {post.comments.map((comment) => (
                                    <div key={comment._id}>
                                       <p className="comment-author">{comment.userName}</p>
                                       <p className="comment-text">{comment.content}</p>
                                    </div>
                                 ))}
                                 <Form
                                    className="bloggs-comment-form"
                                    onSubmit={(e) => {
                                       e.preventDefault();
                                       handleCommentSubmit(post._id);
                                    }}
                                 >
                                    <Form.Group controlId={`commentText-${post._id}`}>
                                       <Form.Control
                                          as="textarea"
                                          rows={3}
                                          placeholder="Write a comment..."
                                          value={commentTexts[post._id] || ""}
                                          onChange={(e) => handleCommentChange(post._id, e.target.value)}
                                          aria-label="Write a comment"
                                       />
                                       <div className="character-counter">
                                          {commentTexts[post._id]?.length || 0}/500
                                       </div>
                                    </Form.Group>
                                    <Button
                                       className="bloggs-submit-bttn"
                                       type="submit"
                                       disabled={!commentTexts[post._id]}
                                    >
                                       Submit
                                    </Button>
                                 </Form>
                              </div>
                           </Card.Footer>
                        </Card>
                     </div>
                  ))
               ) : (
                  <p className="no-blog-posts">No blog posts available.</p>
               )}
            </div>
         )}
      </Container>
   );
}
