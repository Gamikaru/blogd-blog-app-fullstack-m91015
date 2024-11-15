// src/components/PostCard/PostCard.jsx

import { Button } from '@components';
import { useNotificationContext, usePostContext, usePrivateModalContext } from '@contexts';
import { deletePostById } from '@services/api';
import { logger, sanitizeContent } from '@utils';
import { formatDistanceToNow } from "date-fns";
import PropTypes from 'prop-types'; // Import PropTypes
import { memo, useCallback, useMemo } from "react";

const PostCard = memo(({ posts = [], isOwnProfile }) => {
    const { setPosts, setSelectedPost, refreshPosts } = usePostContext();
    const { togglePrivateModal } = usePrivateModalContext();
    const { showNotification, hideNotification } = useNotificationContext();

    // Sort posts by creation date (newest first)
    const sortedPosts = useMemo(() => {
        return [...posts].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }, [posts]);

    // Handler to delete a post
    const handleDeletePost = useCallback(
        async (postId) => {
            try {
                await deletePostById(postId);
                setPosts((prevPosts) => prevPosts.filter((post) => post.postId !== postId));
                refreshPosts();
                showNotification('Post deleted successfully!', 'success');
            } catch (error) {
                logger.error("Error deleting post:", error);
                showNotification('Failed to delete the post. Please try again.', 'error');
            }
        },
        [setPosts, refreshPosts, showNotification]
    );

    // Confirmation before deleting a post
    const confirmDeletePost = useCallback(
        (postId) => {
            showNotification(
                "Are you sure you want to delete this post?",
                'warning',
                false,
                () => handleDeletePost(postId),
                hideNotification
            );
        },
        [handleDeletePost, showNotification, hideNotification]
    );

    // Handler to open edit post modal
    const handleEditPostModal = useCallback(
        (post) => {
            if (post?._id) {
                setSelectedPost(post);
                togglePrivateModal('editPost');
                logger.info("EditPostModal opened for post:", post);
            }
        },
        [setSelectedPost, togglePrivateModal]
    );

    return (
        <div className="post-card-container">
            {sortedPosts.length > 0 ? (
                <div className="posts-scroll-container">
                    {sortedPosts.map((post) => (
                        <div key={post.postId || post._id} className="post-container">
                            <div className="speech-bubble">
                                <div
                                    className="post-text"
                                    dangerouslySetInnerHTML={{ __html: sanitizeContent(post.content) }}
                                    aria-label="Post content"
                                />
                            </div>
                            <div className="post-info">
                                <span className="post-date">
                                    {post.createdAt
                                        ? formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })
                                        : "Date Unavailable"}
                                </span>
                                {/* Conditionally render action buttons based on ownership */}
                                {isOwnProfile && (
                                    <div className="action-buttons">
                                        <Button
                                            variant="edit"
                                            className="button button-edit"
                                            onClick={() => handleEditPostModal(post)}
                                            showIcon={true}
                                            aria-label="Edit post"
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            variant="delete"
                                            className="button button-delete"
                                            onClick={() => confirmDeletePost(post.postId || post._id)}
                                            showIcon={true}
                                            aria-label="Delete post"
                                        >
                                            Delete
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="no-posts-message">No posts available.</p>
            )}
        </div>
    );
});

PostCard.displayName = 'PostCard';

PostCard.propTypes = {
    posts: PropTypes.arrayOf(
        PropTypes.shape({
            postId: PropTypes.string,
            _id: PropTypes.string,
            content: PropTypes.string.isRequired,
            createdAt: PropTypes.string.isRequired,
        })
    ).isRequired,
    isOwnProfile: PropTypes.bool.isRequired,
};

export default PostCard;