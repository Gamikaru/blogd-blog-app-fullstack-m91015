import { Button } from '@components'; // Assuming you have a Modal component
import { useNotificationContext, usePostContext, usePrivateModalContext, useUser } from '@contexts';
import { deletePostById } from '@services/api'; // Ensure these functions are correctly implemented
import { logger } from '@utils';
import { formatDistanceToNow } from 'date-fns';
import { AnimatePresence, motion } from 'framer-motion';
import PropTypes from 'prop-types';
import { memo, useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PostCard = memo(({ post, isOwnProfile }) => {
    const { user } = useUser(); // Get the current user
    const { setPosts, loadPostsByUser, setSelectedPost } = usePostContext();
    const { togglePrivateModal } = usePrivateModalContext();
    const { showNotification } = useNotificationContext();
    const [isDeleting, setIsDeleting] = useState(false);
    const [isVisible, setIsVisible] = useState(true);

    // Handler to delete a post
    const handleDeletePost = useCallback(async () => {
        try {
            setIsDeleting(true);
            await deletePostById(post.postId || post._id);
            setIsVisible(false); // Trigger exit animation
            // Small delay to allow animation to complete
            setTimeout(() => {
                setPosts((prevPosts) => prevPosts.filter((p) => p.postId !== post.postId && p._id !== post._id));
                // Refresh the current user's posts
                loadPostsByUser(user.userId);
            }, 300);
            showNotification('Post deleted successfully!', 'success');
        } catch (error) {
            logger.error("Error deleting post:", error);
            showNotification('Failed to delete the post. Please try again.', 'error');
        } finally {
            setIsDeleting(false);
        }
    }, [post, setPosts, loadPostsByUser, user.userId, showNotification]);

    // Confirmation before deleting a post using toast
    const confirmDeletePost = useCallback((e) => {
        e.stopPropagation();
        showNotification(
            'Are you sure you want to delete this post?',
            'warning',
            false,
            handleDeletePost,
            () => {} // Just closes the toast
        );
    }, [showNotification, handleDeletePost]);

    // Handler to open edit post modal
    const handleEditPostModal = useCallback(() => {
        setSelectedPost(post);
        togglePrivateModal('editPost');
        logger.info("EditPostModal opened for post:", post);
    }, [togglePrivateModal, post, setSelectedPost]);

    const navigate = useNavigate();
    const navigateToPost = useCallback(() => navigate(`/blog/${post.postId || post._id}`), [
        navigate,
        post,
    ]);

    // Return null if not visible
    if (!isVisible) return null;

    return (
        <AnimatePresence>
            <motion.div
                className="profile-post-card"
                layout // Add this
                layoutId={post.postId || post._id} // Add this
                whileHover={{ scale: 1.02, boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.1)' }}
                onClick={navigateToPost}
                role="button"
                tabIndex={0}
                onKeyPress={(e) => {
                    if (e.key === 'Enter') navigateToPost();
                }}
                aria-label={`Go to blog post titled ${post.title || 'Untitled'}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{
                    opacity: { duration: 0.2 },
                    layout: { duration: 0.3 },
                    scale: { duration: 0.2 }
                }}
            >
                {/* Post Image */}
                <div className="profile-post-card__image-container">
                    {post.imageUrls?.length ? (
                        <img
                            src={post.imageUrls[0]}
                            alt={`Cover image for ${post.title || 'Untitled'}`}
                            className="profile-post-card__image"
                            loading="lazy"
                        />
                    ) : post.images?.length ? (
                        <img
                            src={`data:image/jpeg;base64,${post.images[0].data}`}
                            alt={`Cover image for ${post.title || 'Untitled'}`}
                            className="profile-post-card__image"
                            loading="lazy"
                        />
                    ) : (
                        <div className="profile-post-card__image-placeholder" aria-label="No cover image available">
                            No Image
                        </div>
                    )}
                </div>

                {/* Post Content */}
                <div className="profile-post-card__content">
                    <div className="profile-post-card__header">
                        <h4 className="profile-post-card__title">{post.title || 'Untitled'}</h4>
                        <span className="profile-post-card__date">
                            {post.createdAt
                                ? formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })
                                : "Date Unavailable"}
                        </span>
                    </div>
                    <div className="profile-post-card__category">
                        {post.category && <span className="profile-post-card__category-tag">{post.category}</span>}
                    </div>
                </div>

                {/* Post Actions */}
                {isOwnProfile && (
                    <div className="profile-post-card__actions">
                        <Button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleEditPostModal();
                            }}
                            showIcon={true}
                            aria-label="Edit post"
                            variant="edit"
                            disabled={isDeleting}
                        >
                            Edit
                        </Button>
                        <Button
                            onClick={confirmDeletePost}
                            showIcon={true}
                            aria-label="Delete post"
                            disabled={isDeleting}
                            variant="delete"
                        >
                            {isDeleting ? 'Deleting...' : 'Delete'}
                        </Button>
                    </div>
                )}
            </motion.div>
        </AnimatePresence>
    );
});

PostCard.displayName = 'PostCard';

PostCard.propTypes = {
    post: PropTypes.object.isRequired,
    isOwnProfile: PropTypes.bool.isRequired,
};

export default PostCard;