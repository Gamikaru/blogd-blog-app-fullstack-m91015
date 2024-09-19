import React, { useEffect, useState } from "react";
import { Button, Card, Container, Form, Spinner } from "react-bootstrap";
import { useCookies } from "react-cookie";
import { FaHeart } from "react-icons/fa";
import ApiClient from "../ApiClient"; // Use ApiClient for API requests
import { useUser } from "../UserContext"; // Use UserContext to get user info

export default function BloggsPosts() {
    const [cookie] = useCookies();
    const { user } = useUser(); // Get the user from the UserContext
    const [blogPosts, setBlogPosts] = useState([]);
    const [users, setUsers] = useState([]);
    const [commentTexts, setCommentTexts] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        console.log("Component mounted, fetching blog posts and users...");
        fetchBlogPosts();
        fetchUsers();
    }, []);

    const fetchBlogPosts = async () => {
        try {
            console.log("Fetching blog posts...");
            const response = await ApiClient.get(`/post`);
            console.log("Blog posts fetched:", response.data);
            setBlogPosts(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching blog posts:", error);
            setLoading(false);
        }
    };

    const fetchUsers = async () => {
        try {
            console.log("Fetching users...");
            const response = await ApiClient.get(`/user`);
            console.log("Users fetched:", response.data);
            setUsers(response.data);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    const handleLike = async (postId) => {
        try {
            console.log(`Toggling like for post ID: ${postId}`);
            const post = blogPosts.find((post) => post._id === postId);
            const alreadyLiked = post.likesBy?.includes(cookie.userID);
            const url = alreadyLiked
                ? `/post/unlike/${postId}`
                : `/post/like/${postId}`;

            console.log(`Sending ${alreadyLiked ? "unlike" : "like"} request to URL: ${url}`);
            await ApiClient.put(url);

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

            console.log("Updated blog posts after like/unlike:", updatedPosts);
            setBlogPosts(updatedPosts);
        } catch (error) {
            console.error(`Error toggling like/unlike on post:`, error);
        }
    };

    const handleCommentChange = (postId, commentText) => {
        console.log(`Comment text changed for post ID: ${postId}`, commentText);
        setCommentTexts((prevCommentTexts) => ({
            ...prevCommentTexts,
            [postId]: commentText,
        }));
    };

    const handleCommentSubmit = async (postId) => {
        const commentText = commentTexts[postId];
        console.log(`Submitting comment for post ID: ${postId}`, commentText);
        try {
            const response = await ApiClient.post(`/comment`, {
                content: commentText,
                userId: cookie.userID,
                userName: `${user.first_name} ${user.last_name}`,
                postId,
            });

            const newComment = response.data;
            console.log("New comment added:", newComment);
            const updatedPost = blogPosts.map((prevPost) =>
                prevPost._id === postId
                    ? { ...prevPost, comments: [...prevPost.comments, newComment] }
                    : prevPost
            );

            console.log("Updated blog posts after adding comment:", updatedPost);
            setBlogPosts(updatedPost);
            setCommentTexts((prevCommentTexts) => ({ ...prevCommentTexts, [postId]: "" }));
        } catch (error) {
            console.error("Error adding comment:", error);
        }
    };

    const author = (userId) => {
        const foundUser = users.find((user) => user._id === userId);
        const authorName = foundUser ? `${foundUser.first_name} ${foundUser.last_name}` : "";
        console.log(`Author for user ID: ${userId}`, authorName);
        return authorName;
    };

    return (
        <Container>
            {loading ? (
                <div className="loading-spinner">
                    <Spinner animation="border" variant="primary" />
                </div>
            ) : (
                <div className="blog-posts-grid">
                    {blogPosts.length > 0 ? (
                        blogPosts.map((post) => (
                            <div key={post._id}>
                                <Card className="bloggs-post-section">
                                    <Card.Body className="bloggs-body">
                                        <Card.Title className="bloggs-card-title">
                                            <span className="username">{author(post.user_id)}</span>
                                        </Card.Title>
                                        <Card.Text className="speech-bubble">
                                            <span className="post-text">{post.content}</span>
                                        </Card.Text>
                                        <div className="post-interactions">
                                            <Button
                                                className="like-button"
                                                onClick={() => handleLike(post._id)}
                                                aria-label={
                                                    post.likesBy?.includes(cookie.userID)
                                                        ? "Unlike"
                                                        : "Like"
                                                }
                                            >
                                                {post.likesBy?.includes(cookie.userID)
                                                    ? "Unlike"
                                                    : "Like"}
                                            </Button>
                                            <div className="like-section">
                                                <FaHeart className="heart-icon" />
                                                <span className="likes-count">{post.likes}</span>
                                            </div>
                                            <div className="date-section">
                                                {new Date(post.time_stamp).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </Card.Body>
                                    <Card.Footer className="bloggs-card-footer">
                                        <div className="bloggs-comments">
                                            {post.comments.map((comment) => (
                                                <div key={comment._id}>
                                                    <p className="comment-author">{comment.userName}</p>
                                                    <p className="comment-text">{comment.text}</p>
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
                                                        onChange={(e) =>
                                                            handleCommentChange(
                                                                post._id,
                                                                e.target.value
                                                            )
                                                        }
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