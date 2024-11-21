// src/components/Comment.jsx

import { Button, ErrorBoundary } from '@components';
import { useCommentActions } from '@contexts';
import { useUser } from '@contexts/UserContext';
import { logger } from '@utils';
import PropTypes from 'prop-types';
import { useState } from 'react';

const Comment = ({ comment }) => {
    const { user } = useUser();
    const { likeAComment, unlikeAComment, replyToAComment } = useCommentActions();
    const [showReply, setShowReply] = useState(false);
    const [replyText, setReplyText] = useState('');
    const [likes, setLikes] = useState(comment.likes);

    const userId = user?.id || user?._id; // Adjust based on your user object

    const isLiked = userId
        ? comment.likesBy.includes(userId)
        : false;

    const handleLike = async () => {
        try {
            if (isLiked) {
                await unlikeAComment(comment._id, comment.postId, userId);
                setLikes(likes - 1);
            } else {
                await likeAComment(comment._id, comment.postId, userId);
                setLikes(likes + 1);
            }
        } catch (error) {
            logger.error('Error toggling like:', error);
        }
    };

    const handleReply = async (e) => {
        e.preventDefault();
        if (replyText.trim() === '') return;

        try {
            await replyToAComment(comment._id, replyText);
            setReplyText('');
            setShowReply(false);
            // Optionally, refresh comments or update state
        } catch (error) {
            logger.error('Error replying to comment:', error);
        }
    };

    return (
        <ErrorBoundary>
            <div className="comment">
                <div className="comment-header">
                    {comment.userId.profilePicture && (
                        <img
                            src={comment.userId.profilePicture}
                            alt={`${comment.userId.firstName} ${comment.userId.lastName}`}
                            className="profile-picture"
                        />
                    )}
                    <p className="comment-author">
                        {comment.userId
                            ? `${comment.userId.firstName} ${comment.userId.lastName}`
                            : 'Unknown User'}
                    </p>
                </div>
                <p className="comment-date">
                    {new Date(comment.createdAt).toLocaleString()}
                </p>
                <p className="comment-text">{comment.content}</p>
                <div className="comment-actions">
                    <Button onClick={handleLike} variant="like">
                        {isLiked ? 'Unlike' : 'Like'} ({likes})
                    </Button>
                    <Button
                        onClick={() => setShowReply(!showReply)}
                        variant="reply"
                    >
                        Reply
                    </Button>
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
                        <Button
                            type="submit"
                            variant="submit"
                            disabled={!replyText.trim()}
                        >
                            Submit
                        </Button>
                    </form>
                )}
                {/* Render Replies */}
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

//props validation
Comment.propTypes = {
    comment: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        content: PropTypes.string.isRequired,
        userId: PropTypes.shape({
            firstName: PropTypes.string.isRequired,
            lastName: PropTypes.string.isRequired,
            _id: PropTypes.string.isRequired,
            profilePicture: PropTypes.string, // Added profilePicture
        }),
        createdAt: PropTypes.string.isRequired,
        likes: PropTypes.number.isRequired,
        likesBy: PropTypes.arrayOf(PropTypes.string).isRequired,
        replies: PropTypes.arrayOf(PropTypes.object),
        postId: PropTypes.string.isRequired,
    }).isRequired,
};

export default Comment;