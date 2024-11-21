// FullBlogView.jsx
import { Button, Comment, ErrorBoundary, Spinner } from '@components';
import { useCommentActions, useComments } from '@contexts/CommentContext';
import { useUser } from '@contexts/UserContext';
import { fetchPostById } from '@services/api';
import { logger } from '@utils';
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const COMMENTS_PER_PAGE = 5;

const FullBlogView = () => {
    const { id } = useParams();
    const { user } = useUser();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [commentText, setCommentText] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    const { comments, loadingComments, loadCommentsForPost, errorComments } = useComments();
    const { addComment } = useCommentActions();

    const fetchPost = useCallback(async () => {
        try {
            const fetchedPost = await fetchPostById(id);
            setPost({ ...fetchedPost, postId: fetchedPost._id });
            setLoading(false);
        } catch (error) {
            logger.error('Error fetching post:', error);
            setError('Failed to fetch post');
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        logger.info(`Fetching post with ID: ${id}`);
        fetchPost();
    }, [id, fetchPost]);

    useEffect(() => {
        if (post && post.postId) {
            loadCommentsForPost(post.postId);
        }
    }, [post, loadCommentsForPost]);

    const handleCommentChange = (e) => {
        setCommentText(e.target.value);
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();

        const userId = user?.id || user?._id;

        if (!user || !userId) {
            logger.error("User must be logged in to submit comments.");
            setError("You must be logged in to submit comments.");
            return;
        }

        try {
            await addComment(post.postId, commentText, user); // Removed 'const newComment ='
            logger.info(`Comment submitted for post ${post.postId}: ${commentText}`);
            setCommentText("");
            // Removed 'loadCommentsForPost' call to prevent full re-render
        } catch (error) {
            logger.error("Error submitting comment:", error);
            setError("Failed to submit comment.");
        }
    };

    const handleLoadMore = () => {
        setCurrentPage(prevPage => prevPage + 1);
    };

    if (loading) return <Spinner message="Loading post..." />;
    if (error) return <div>Error: {error}</div>;

    const authorInfo = post.userId.aboutAuthor || `${post.userId.firstName} ${post.userId.lastName}, ${post.userId.occupation}`;

    const allComments = comments[post.postId] || [];
    const displayedComments = allComments.slice(0, currentPage * COMMENTS_PER_PAGE);
    const hasMoreComments = displayedComments.length < allComments.length;

    return (
        <ErrorBoundary>
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
                    <h3>Comments</h3>
                    {loadingComments ? (
                        <Spinner message="Loading comments..." />
                    ) : errorComments ? (
                        <div>Error: {errorComments}</div>
                    ) : (
                        <div>
                            {displayedComments.length > 0 ? (
                                displayedComments.map((comment) => (
                                    <Comment key={comment._id} comment={comment} />
                                ))
                            ) : (
                                <p>No comments yet.</p>
                            )}
                            {hasMoreComments && (
                                <Button onClick={handleLoadMore} variant="secondary" className="load-more-button">
                                    Load More Comments
                                </Button>
                            )}
                        </div>
                    )}
                    <form
                        className="comment-form"
                        onSubmit={handleCommentSubmit}
                    >
                        <textarea
                            rows={3}
                            placeholder="Write a comment..."
                            value={commentText}
                            onChange={handleCommentChange}
                            maxLength={500}
                            required
                        />
                        <Button
                            type="submit"
                            variant="submit"

                            disabled={!commentText.trim()}
                        >
                            Submit
                        </Button>
                    </form>
                    {error && <div className="error-message">{error}</div>}
                </div>
            </div>
        </ErrorBoundary>
    );
};

export default FullBlogView;