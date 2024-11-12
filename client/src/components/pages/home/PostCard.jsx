import { Button } from '@components';
import { useNotificationContext, usePostContext, usePrivateModalContext, useUser } from '@contexts';
import { deletePostById } from '@services/api';
import { logger, sanitizeContent } from '@utils';
import { formatDistanceToNow } from "date-fns";
import { memo, useCallback, useMemo } from "react";

const PostCard = memo(({ posts = [] }) => {
    const { setPosts, setSelectedPost, refreshPosts } = usePostContext();
    const { togglePrivateModal } = usePrivateModalContext();
    const { showNotification, hideNotification } = useNotificationContext();
    const { user } = useUser();

    const sortedPosts = useMemo(() => {
        return [...posts].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }, [posts]);

    const isCurrentUserPost = useCallback(
        (postUserId) => user.userId === postUserId,
        [user.userId]
    );

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

    const handleEditPostModal = useCallback(
        (post) => {
            if (post?._id) {
                setSelectedPost(post);
                togglePrivateModal('editPost');
            }
        },
        [setSelectedPost, togglePrivateModal]
    );

    return (
        <div className="post-card-container">
            {sortedPosts.length > 0 ? (
                <div className="posts-scroll-container">
                    {sortedPosts.map((post) => (
                        <div key={post.postId} className="post-container">
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
                                {isCurrentUserPost(post.userId) && (
                                    <div className="action-buttons">
                                        <div>

                                        </div>
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
                                            onClick={() => confirmDeletePost(post.postId)}
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
export default PostCard;