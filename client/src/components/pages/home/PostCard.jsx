import { Button, deletePostById, Logger, sanitizeContent, useNotificationContext, usePostContext, usePrivateModalContext, useUser } from '@components';
import { formatDistanceToNow } from "date-fns";
import React, { useCallback } from "react";

const PostCard = ({ posts = [] }) => {
    const { setPosts, setSelectedPost, refreshPosts } = usePostContext();
    const { togglePrivateModal } = usePrivateModalContext();
    const { showNotification, hideNotification } = useNotificationContext();
    const { user } = useUser(); // Get current logged-in user

    // And update the sorting logic:
    const sortedPosts = [...posts].sort((a, b) =>
        new Date(b.createdAt) - new Date(a.createdAt)
    );

    // Only show edit/delete buttons if the post belongs to the current user
    const isCurrentUserPost = (postUserId) => {
        return user._id === postUserId;
    };

    const handleDeletePost = useCallback(async (postId) => {
        try {
            await deletePostById(postId);
            setPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId));
            refreshPosts();
            showNotification('Post deleted successfully!', 'success');
        } catch (error) {
            Logger.error("Error deleting post:", error);
            showNotification('Failed to delete the post. Please try again.', 'error');
        }
    }, [setPosts, refreshPosts, showNotification]);

    const confirmDeletePost = useCallback((postId) => {
        showNotification(
            "Are you sure you want to delete this post?",
            'warning',
            false,
            () => handleDeletePost(postId),
            hideNotification
        );
    }, [handleDeletePost, showNotification, hideNotification]);

    const handleEditPostModal = useCallback((post) => {
        if (post?._id) {
            setSelectedPost(post);
            togglePrivateModal('editPost');
        }
    }, [setSelectedPost, togglePrivateModal]);

    return (
        <div className="post-card-container">
            {sortedPosts.length > 0 ? (
                <div className="posts-scroll-container">
                    {sortedPosts.map((post) => (
                        <div key={post._id} className="post-container">
                            <div className="speech-bubble">
                                <div
                                    className="post-text"
                                    dangerouslySetInnerHTML={{ __html: sanitizeContent(post.content) }}
                                />
                            </div>
                            <div className="post-info">
                                <span className="post-date">
                                    {post.createdAt
                                        ? formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })
                                        : "Date Unavailable"}
                                </span>
                                {isCurrentUserPost(post.userId) && (
                                    <div className="action-buttons">
                                        <Button
                                            className="button button-edit"
                                            onClick={() => handleEditPostModal(post)}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            className="button button-delete"
                                            onClick={() => confirmDeletePost(post._id)}
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
};

export default PostCard;