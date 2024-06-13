import React, { useEffect, useState } from "react";
import { Container, Card, Form, Button } from "react-bootstrap";
import { useCookies } from "react-cookie";

export default function BloggsPosts() {
    const [cookie, setCookie, removeCookie] = useCookies();
    const [blogPosts, setBlogPosts] = useState([]);
    const [user, setUser] = useState({
        first_name: "",
        last_name: "",
        status: "",
        email: "",
        birthdate: "",
        occupation: "",
        location: "",
    });
    const [commentText, setCommentText] = useState("");
	const [users, setUsers] = useState([]);
	
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
			// Fetch posts for each user after fetching users
			// data.forEach((user) => fetchUserPost(user._id, token));
		} catch (error) {
			console.error("Error fetching users:", error);
		}};

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
                throw new Error(
                    `Failed to ${alreadyLiked ? "unlike" : "like"} the post`
                );
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
            console.error(
                `Error toggling ${alreadyLiked ? "unlike" : "like"}:`,
                error
            );
        }
    };

    const handleLikeComment = async (postId, commentId, alreadyLiked) => {
        const token = cookie.PassBloggs;
        try {
            const post = blogPosts.find((post) => post._id === postId);
            if (!post) {
                throw new Error("Post not found");
            }

            const comment = post.comments.find(
                (comment) => comment._id === commentId
            );
            if (!comment) {
                throw new Error("Comment not found");
            }

            const url = alreadyLiked
                ? `http://localhost:5050/post/comment/unlike/${postId}/${commentId}`
                : `http://localhost:5050/post/comment/like/${postId}/${commentId}`;

            const response = await fetch(url, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error(
                    `Failed to ${alreadyLiked ? "unlike" : "like"} the comment`
                );
            }

            const updatedPosts = blogPosts.map((prevPost) =>
                prevPost._id === postId
                    ? {
                          ...prevPost,
                          comments: prevPost.comments.map((prevComment) =>
                              prevComment._id === commentId
                                  ? {
                                        ...prevComment,
                                        likes: alreadyLiked
                                            ? prevComment.likes - 1
                                            : prevComment.likes + 1,
                                        likesBy: alreadyLiked
                                            ? prevComment.likesBy.filter(
                                                  (userId) => userId !== cookie.userID
                                              )
                                            : [...(prevComment.likesBy || []), cookie.userID],
                                    }
                                  : prevComment
                          ),
                      }
                    : prevPost
            );

            setBlogPosts(updatedPosts);
        } catch (error) {
            console.error(
                `Error toggling ${alreadyLiked ? "unlike" : "like"} on comment:`,
                error
            );
        }
    };

    const handleCommentSubmit = async (postId, commentText) => {
        const token = cookie.PassBloggs;
        try {
            const response = await fetch(
                `http://localhost:5050/post/comment/${postId}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        text: commentText,
                    }),
                }
            );

            if (!response.ok) {
                throw new Error("Failed to add comment");
            }

            const newComment = await response.json();

            const updatedPosts = blogPosts.map((prevPost) =>
                prevPost._id === postId
                    ? {
                          ...prevPost,
                          comments: [...prevPost.comments, newComment],
                      }
                    : prevPost
            );

            setBlogPosts(updatedPosts);
            setCommentText("");
        } catch (error) {
            console.error("Error adding comment:", error);
        }
    };

    const getInitials = (firstName, lastName) => {
        const firstInitial = firstName ? firstName.charAt(0).toUpperCase() : "";
        const lastInitial = lastName ? lastName.charAt(0).toUpperCase() : "";
        return `${firstInitial}${lastInitial}`;
    };

    const userInitials = getInitials(user.first_name, user.last_name);
	const author = (user_id) => {
		console.log(user_id)
		const foundUsers = users.find((user) => user._id === user_id);
		const userInitials = getInitials(foundUsers.first_name, foundUsers.last_name)
		return userInitials
	}

    return (
        <Container className="blogg-container">
            <div className="blog-posts">
                {blogPosts.length > 0 ? (
                    blogPosts.map((post, index) => (
                        <Card className="bloggs-post-section" key={index}>
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
                                    <div key={comment._id} className="comment">
                                        <p className="comment-author">{comment.author}</p>
                                        <p className="comment-text">{comment.text}</p>
                                        <Button
                                            className="comment-like-button"
                                            onClick={() =>
                                                handleLikeComment(
                                                    post._id,
                                                    comment._id,
                                                    comment.likesBy &&
                                                        comment.likesBy.includes(cookie.userID)
                                                )
                                            }
                                        >
                                            {comment.likesBy &&
                                                comment.likesBy.includes(cookie.userID)
                                                ? "Unlike"
                                                : "Like"}
                                        </Button>
                                    </div>
                                ))}
                                <Form
                                    className="bloggs-comment-form"
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        handleCommentSubmit(post._id, commentText);
                                    }}
                                >
                                    <Form.Group controlId={`commentText-${post._id}`}>
                                        <Form.Control
                                            className="bloggs-form-control"
                                            as="textarea"
                                            rows={3}
                                            placeholder="Write a comment..."
                                            value={commentText}
                                            onChange={(e) => setCommentText(e.target.value)}
                                        />
                                    </Form.Group>
                                    <Button className="bloggs-submit-bttn" type="submit">
                                        Submit
                                    </Button>
                                </Form>
                            </div>
                        </Card>
                    ))
                ) : (
                    <p className="no-blog-posts">No blog posts available.</p>
                )}
            </div>
        </Container>
    );
}
