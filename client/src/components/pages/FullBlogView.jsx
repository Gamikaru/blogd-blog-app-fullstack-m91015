// FullBlogView.jsx
// Desc: Full blog view component

import { Button, fetchPostById, Logger, Spinner } from '@components';
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const FullBlogView = () => {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [commentTexts, setCommentTexts] = useState({});

    useEffect(() => {
        Logger.info(`Fetching post with ID: ${id}`);
        fetchPost();
    }, [id]);

    const fetchPost = async () => {
        try {
            const fetchedPost = await fetchPostById(id);
            setPost(fetchedPost);
            setLoading(false);
        } catch (error) {
            Logger.error("Error fetching post:", error);
            setError("Failed to fetch post");
            setLoading(false);
        }
    };

    const handleCommentChange = (postId, commentText) => {
        setCommentTexts((prevCommentTexts) => ({
            ...prevCommentTexts,
            [postId]: commentText,
        }));
    };

    const handleCommentSubmit = async (postId) => {
        const commentText = commentTexts[postId];
        try {
            // Handle comment submit
            // Example:
            // await submitComment(postId, commentText);
            Logger.info(`Submitting comment for post ${postId}: ${commentText}`);
            // Reset comment text after submission
            setCommentTexts((prev) => ({ ...prev, [postId]: "" }));
        } catch (error) {
            Logger.error("Error submitting comment:", error);
        }
    };

    if (loading) return <Spinner message="Loading post..." />;
    if (error) return <div>Error: {error}</div>;

    const authorInfo = post.userId.aboutAuthor || `${post.userId.firstName} ${post.userId.lastName}, ${post.userId.occupation}`;

    return (
        <div className="full-blog-view">
            <div className="blog-images">
                {post.imageUrls && post.imageUrls.map((url, index) => (
                    <img key={index} src={url} alt={`Blog image ${index + 1}`} className="blog-image" />
                ))}
                {post.images && post.images.map((image, index) => (
                    <img key={index} src={`data:image/jpeg;base64,${image.data}`} alt={`Blog image ${index + 1}`} className="blog-image" />
                ))}
            </div>
            <div
                className="blog-content"
                dangerouslySetInnerHTML={{
                    __html: post.content
                }}
            />
            <div className="about-author">
                <h3>About the Author</h3>
                <p>{authorInfo}</p>
            </div>
            <div className="comments-section">
                {post.comments.map((comment) => (
                    <div key={comment._id} className="comment">
                        <p className="comment-author">{comment.userName}</p>
                        <p className="comment-text">{comment.content}</p>
                    </div>
                ))}
                <form
                    className="comment-form"
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleCommentSubmit(post._id);
                    }}
                >
                    <textarea
                        rows={3}
                        placeholder="Write a comment..."
                        value={commentTexts[post._id] || ""}
                        onChange={(e) => handleCommentChange(post._id, e.target.value)}
                        maxLength={500}
                    />
                    <Button
                        type="submit"
                        variant="submit" // Use 'submit' variant for FiCheck icon
                        className="submit-comment-button"
                        disabled={!commentTexts[post._id]}
                        // Optionally, you can set showIcon={false} if you don't want the icon
                        // showIcon={false}
                    >
                        Submit
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default FullBlogView;