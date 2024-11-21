// Comment.jsx
import { Button, ErrorBoundary } from '@components';
import { useCommentActions } from '@contexts/CommentContext';
import { useUser } from '@contexts/UserContext';
import { logger } from '@utils';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import { memo, useState } from 'react';
import { FaHeart } from 'react-icons/fa';
import { FiHeart } from 'react-icons/fi';

const Comment = ({ comment }) => {
    const { user } = useUser();
    const {
        likeAComment,
        unlikeAComment,
        replyToAComment,
        updateExistingComment,
        removeComment,
    } = useCommentActions();
    const [showReply, setShowReply] = useState(false);
    const [replyText, setReplyText] = useState('');
    const [likes, setLikes] = useState(comment.likes);
    const [isAnimating, setIsAnimating] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState(comment.content);

    const userId = user?.id || user?._id;

    const isLiked = (userId && comment.likesBy?.includes(userId)) || false;
    const isCurrentUser = userId === (comment.userId?._id || comment.userId);

    const handleLike = async () => {
        try {
            setIsAnimating(true);
            if (isLiked) {
                await unlikeAComment(comment._id, comment.postId, userId);
                setLikes((prevLikes) => prevLikes - 1);
            } else {
                await likeAComment(comment._id, comment.postId, userId);
                setLikes((prevLikes) => prevLikes + 1);
            }
        } catch (error) {
            logger.error('Error toggling like:', error);
        } finally {
            setIsAnimating(false);
        }
    };

    const handleReply = async (e) => {
        e.preventDefault();
        if (replyText.trim() === '') return;

        try {
            await replyToAComment(comment._id, replyText, user); // Pass user
            setReplyText('');
            setShowReply(false);
        } catch (error) {
            logger.error('Error replying to comment:', error);
        }
    };

    const handleEdit = async (e) => {
        e.preventDefault();
        if (editText.trim() === '') return;

        try {
            await updateExistingComment(comment._id, editText);
            setIsEditing(false);
        } catch (error) {
            logger.error('Error updating comment:', error);
        }
    };

    const handleDelete = async () => {
        const confirmed = window.confirm('Are you sure you want to delete this comment?');
        if (!confirmed) return;

        try {
            await removeComment(comment._id, comment.postId);
        } catch (error) {
            logger.error('Error deleting comment:', error);
        }
    };

    const formattedDate = new Date(comment.createdAt).toLocaleString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
    });

    return (
        <ErrorBoundary>
            <div className="comment">
                <div className="comment__header">
                    <div className="comment__author-info">
                        {comment.userId?.profilePicture && typeof comment.userId === 'object' && (
                            <img
                                src={comment.userId.profilePicture}
                                alt={`${comment.userId.firstName} ${comment.userId.lastName}`}
                                className="comment__profile-picture"
                            />
                        )}
                        <span className="comment__header__author">
                            {typeof comment.userId === 'object'
                                ? `${comment.userId.firstName} ${comment.userId.lastName}`
                                : 'Unknown User'}
                        </span>
                    </div>
                    <span className="comment__header__date">{formattedDate}</span>

                </div>
                {isEditing ? (
                    <form className="edit-form" onSubmit={handleEdit}>
                        <textarea
                            rows={2}
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            maxLength={500}
                            required
                        />
                        <Button type="submit" variant="submit">
                            Save
                        </Button>
                        <Button onClick={() => setIsEditing(false)} variant="secondary">
                            Cancel
                        </Button>
                    </form>
                ) : (
                    <div className="comment__body">{comment.content}</div>
                )}
                <div className="comment__footer">
                    <div className="comment__actions-left">
                        <Button
                            onClick={handleLike}
                            variant="iconButton"
                            aria-label={isLiked ? 'Unlike' : 'Like'}
                            filled={isLiked}
                        >
                            <motion.div
                                initial={{ scale: 1 }}
                                animate={{ scale: isAnimating ? 1.2 : 1 }}
                                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                            >
                                {isLiked ? <FaHeart /> : <FiHeart />}
                            </motion.div>
                        </Button>
                        <span className="like-count">{likes}</span>
                        <Button onClick={() => setShowReply(!showReply)} variant="submit">
                            Reply
                        </Button>
                    </div>
                    {isCurrentUser && (
                        <div className="comment__controls">
                            <Button onClick={() => setIsEditing(!isEditing)} variant="edit">
                                Edit
                            </Button>
                            <Button onClick={handleDelete} variant="delete">
                                Delete
                            </Button>
                        </div>
                    )}
                </div>
                {showReply && (
                    <form className="reply-form" onSubmit={handleReply}>
                        <textarea
                            rows={2}
                            placeholder="Write a reply..."
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            maxLength={500}
                            required
                        />
                        <Button type="submit" variant="submit" disabled={!replyText.trim()}>
                            Submit
                        </Button>
                    </form>
                )}
                {comment.replies && comment.replies.length > 0 && (
                    <div className="replies">
                        {comment.replies.map((reply) => (
                            <Comment key={reply._id} comment={reply} />
                        ))}
                    </div>
                )}
            </div>
        </ErrorBoundary>
    );
};

Comment.propTypes = {
    comment: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        content: PropTypes.string.isRequired,
        userId: PropTypes.oneOfType([
            PropTypes.shape({
                firstName: PropTypes.string.isRequired,
                lastName: PropTypes.string.isRequired,
                _id: PropTypes.string.isRequired,
                profilePicture: PropTypes.string,
            }),
            PropTypes.string, // In case it's just the user ID string
        ]).isRequired,
        createdAt: PropTypes.string.isRequired,
        likes: PropTypes.number.isRequired,
        likesBy: PropTypes.arrayOf(PropTypes.string).isRequired,
        replies: PropTypes.arrayOf(PropTypes.object),
        postId: PropTypes.string.isRequired,
    }).isRequired,
};

// Custom comparison to prevent unnecessary re-renders
const areEqual = (prevProps, nextProps) => {
    return (
        prevProps.comment._id === nextProps.comment._id &&
        prevProps.comment.likes === nextProps.comment.likes &&
        prevProps.comment.likesBy.length === nextProps.comment.likesBy.length &&
        prevProps.comment.content === nextProps.comment.content &&
        prevProps.comment.replies === nextProps.comment.replies && // Compare replies array reference
        prevProps.comment.userId === nextProps.comment.userId
    );
};

export default memo(Comment, areEqual);