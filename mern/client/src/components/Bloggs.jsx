import React, { useEffect, useState } from "react";
import { Button, Card, Container, Form } from "react-bootstrap";
import { useCookies } from "react-cookie";
// Import the relevant CSS for Blog Posts
import "../styles/bloggs_page.css"; // Assuming you have a styles folder with Bloggs.css

export default function BloggsPosts() {
    const [cookie] = useCookies(); // assuming you only read cookies here
    const [blogPosts, setBlogPosts] = useState([]);
    const [user, setUser] = useState({
        first_name: "",
        last_name: "",
    });
    const [users, setUsers] = useState([]);
    const [commentTexts, setCommentTexts] = useState({});

    useEffect(() => {
        fetchBlogPosts();
        fetchUser();
        fetchUsers();
    }, []);

    const fetchUser = async () => {
        const token = cookie.PassBloggs;
        try {
            const response = await fetch(
                `http://localhost:5050/user/${cookie.userID}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            if (!response.ok) {
                throw new Error(`Failed to fetch user data: ${response.statusText}`);
            }
            const userData = await response.json();
            setUser(userData);
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    };

    const fetchBlogPosts = async () => {
        const token = cookie.PassBloggs;
        try {
            const response = await fetch(
                `http://localhost:5050/post`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            if (!response.ok) {
                throw new Error("Failed to fetch blog posts");
            }
            const postData = await response.json();
            setBlogPosts(postData);
        } catch (error) {
            console.error("Error fetching blog posts:", error);
        }
    };

    const fetchUsers = async () => {
        const token = cookie.PassBloggs;
        try {
            const response = await fetch(`http://localhost:5050/user`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            const data = await response.json();
            setUsers(data);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    const handleLike = async (postId) => {
        try {
            const post = blogPosts.find((post) => post._id === postId);
            if (!post) {
                throw new Error("Post not found");
            }

            const alreadyLiked = post.likesBy && post.likesBy.includes(cookie.userID);
            const url = alreadyLiked
                ? `http://localhost:5050/post/unlike/${postId}`
                : `http://localhost:5050/post/like/${postId}`;

            const response = await fetch(url, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${cookie.PassBloggs}`,
                },
            });

            if (!response.ok) {
                throw new Error(`Failed to ${alreadyLiked ? "unlike" : "like"} the post`);
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

            setBlogPosts(updatedPosts);
        } catch (error) {
            console.error(`Error toggling ${alreadyLiked ? "unlike" : "like"} on post:`, error);
        }
    };

    const handleCommentChange = (postId, commentText) => {
        setCommentTexts((prevCommentTexts) => ({ ...prevCommentTexts, [postId]: commentText }));
    };

    const handleCommentSubmit = async (postId) => {
        const commentText = commentTexts[postId];
        try {
            const response = await fetch(`http://localhost:5050/comment`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${cookie.PassBloggs}`,
                },
                body: JSON.stringify({
                    content: commentText,
                    userId: cookie.userID,
                    userName: `${user.first_name} ${user.last_name}`,
                    postId: postId,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to add comment");
            }

            const newComment = await response.json();

            const updatedPost = blogPosts.map((prevPost) =>
                prevPost._id === postId
                    ? {
                        ...prevPost,
                        comments: [...prevPost.comments, newComment],
                    }
                    : prevPost
            );

            setBlogPosts(updatedPost);

            setCommentTexts((prevCommentTexts) => ({ ...prevCommentTexts, [postId]: "" }));
        } catch (error) {
            console.error("Error adding comment:", error);
        }
    };

    const getInitials = (firstName, lastName) => {
        const firstInitial = firstName ? firstName.charAt(0).toUpperCase() : "";
        const lastInitial = lastName ? lastName.charAt(0).toUpperCase() : "";
        return `${firstInitial}${lastInitial}`;
    };

    const author = (userId) => {
        const foundUser = users.find((user) => user._id === userId);
        if (foundUser) {
            return getInitials(foundUser.first_name, foundUser.last_name);
        } else {
            return ""; // or some default value
        }
    };

    return (
        <Container className="blogg-container">
            <div className="blog-posts">
                {blogPosts.length > 0 ? (
                    blogPosts.map((post) => (
                        <div key={post._id}> {/* Ensure key prop here */}
                            <Card className="bloggs-post-section">
                                <Card.Body className="bloggs-body">
                                    <Card.Title className="bloggs-card-title">
                                        {author(post.user_id)}
                                    </Card.Title>
                                    <Card.Text className="bloggs-card-text">
                                        {post.content}
                                    </Card.Text>
                                </Card.Body>
                                <Card.Footer className="bloggs-card-footer">
                                    <small className="text-muted">
                                        <span className="blog-author">{post.author}</span>
                                        <span className="blog-date">
                                            {new Date(post.time_stamp).toLocaleDateString()}
                                        </span>
                                    </small>
                                    <span className="bloggs-likes">
                                        Likes: {post.likes}
                                        <Button
                                            className="like-button"
                                            onClick={() => handleLike(post._id)}
                                        >
                                            {post.likesBy && post.likesBy.includes(cookie.userID)
                                                ? "Unlike"
                                                : "Like"}
                                        </Button>
                                    </span>
                                </Card.Footer>
                                <div className="bloggs-comments">
                                    {post.comments.map((comment) => (
                                        <div key={comment._id}> {/* Ensure key prop here */}
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
                                                className="bloggs-form-control"
                                                as="textarea"
                                                rows={3}
                                                placeholder="Write a comment..."
                                                value={commentTexts[post._id] || ''}
                                                onChange={(e) => handleCommentChange(post._id, e.target.value)}
                                            />
                                        </Form.Group>
                                        <Button className="bloggs-submit-bttn" type="submit">
                                            Submit
                                        </Button>
                                    </Form>
                                </div>
                            </Card>
                        </div>
                    ))
                ) : (
                    <p className="no-blog-posts">No blog posts available.</p>
                )}
            </div>
        </Container>
    );
}
