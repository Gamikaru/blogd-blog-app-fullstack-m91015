// src/contexts/CommentContext.jsx

import {
    createComment,
    deleteComment,
    fetchCommentsByPostId,
    likeComment,
    replyToComment,
    unlikeComment,
    updateComment,
} from '@services/api';
import { logger } from '@utils';
import PropTypes from 'prop-types';
import { createContext, useCallback, useContext, useState } from 'react';

// Create contexts
const CommentContext = createContext();
const CommentUpdateContext = createContext();

// Custom hooks for using the contexts
export const useComments = () => useContext(CommentContext);
export const useCommentActions = () => useContext(CommentUpdateContext);

// Provider component
export const CommentProvider = ({ children }) => {
    const [comments, setComments] = useState({});
    const [loadingComments, setLoadingComments] = useState(false);
    const [errorComments, setErrorComments] = useState(null);

    // Function to build a comment tree
    const buildCommentTree = (commentsList) => {
        const commentMap = {};
        commentsList.forEach((comment) => {
            comment.replies = [];
            commentMap[comment.commentId] = comment;
        });

        const commentTree = [];
        commentsList.forEach((comment) => {
            if (comment.parentId && commentMap[comment.parentId]) {
                commentMap[comment.parentId].replies.push(comment);
            } else {
                commentTree.push(comment);
            }
        });

        // Sort comments by createdAt descending (newest first)
        commentTree.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        return commentTree;
    };

    // Function to fetch comments for a post
    const loadCommentsForPost = useCallback(async (postId) => {
        setLoadingComments(true);
        setErrorComments(null);
        try {
            const fetchedComments = await fetchCommentsByPostId(postId);
            // Build the comment tree
            const commentTree = buildCommentTree(fetchedComments);
            setComments((prev) => ({
                ...prev,
                [postId]: commentTree,
            }));
            logger.info(`Comments loaded for post ${postId}`);
        } catch (error) {
            logger.error('Error loading comments:', error);
            setErrorComments('Failed to load comments.');
        } finally {
            setLoadingComments(false);
        }
    }, []);

    // Function to add a new comment
    const addComment = useCallback(async (postId, content, user) => {
        try {
            const commentData = { content, postId };
            const newCommentResponse = await createComment(commentData);
            const newComment = {
                ...newCommentResponse.comment,
                likes: newCommentResponse.comment.likes || 0,
                likesBy: newCommentResponse.comment.likesBy || [],
                replies: [], // Initialize replies
            };

            // Attach user details
            newComment.userId = {
                _id: user._id || user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                profilePicture: user.profilePicture,
            };

            setComments((prev) => ({
                ...prev,
                [postId]: [newComment, ...(prev[postId] || [])],
            }));
            logger.info(`Comment added to post ${postId}`);
            return newComment;
        } catch (error) {
            logger.error('Error adding comment:', error);
            throw error;
        }
    }, []);

    // Function to update a comment
    const updateExistingComment = useCallback(async (commentId, content) => {
        try {
            const updatedData = { content };
            const updatedCommentResponse = await updateComment(commentId, updatedData);
            const updatedComment = updatedCommentResponse.comment;
            const postId = updatedComment.postId;

            // Update the comment in state
            const updateCommentInState = (commentsArray) => {
                return commentsArray.map((comment) => {
                    if (comment.commentId === commentId) {
                        return {
                            ...comment,
                            content: updatedComment.content,
                        };
                    } else if (comment.replies && comment.replies.length > 0) {
                        return {
                            ...comment,
                            replies: updateCommentInState(comment.replies),
                        };
                    }
                    return comment;
                });
            };

            setComments((prevComments) => {
                const updatedPostComments = updateCommentInState(prevComments[postId]);
                return {
                    ...prevComments,
                    [postId]: updatedPostComments,
                };
            });
            logger.info(`Comment ${commentId} updated`);
            return updatedComment;
        } catch (error) {
            logger.error('Error updating comment:', error);
            throw error;
        }
    }, []);

    // Function to delete a comment
    const removeComment = useCallback(async (commentId, postId) => {
        try {
            await deleteComment(commentId);

            const removeCommentFromState = (commentsArray) => {
                return commentsArray
                    .filter((comment) => comment.commentId !== commentId)
                    .map((comment) => ({
                        ...comment,
                        replies: removeCommentFromState(comment.replies || []),
                    }));
            };

            setComments((prevComments) => {
                const updatedPostComments = removeCommentFromState(prevComments[postId]);
                return {
                    ...prevComments,
                    [postId]: updatedPostComments,
                };
            });
            logger.info(`Comment ${commentId} and its replies deleted from post ${postId}`);
        } catch (error) {
            logger.error('Error deleting comment:', error);
            throw error;
        }
    }, []);

    // Function to like a comment
    const likeAComment = useCallback(async (commentId, postId, userId) => {
        try {
            const response = await likeComment(commentId);
            const updatedLikes = response.likes;

            const updateLikesInState = (commentsArray) => {
                return commentsArray.map((comment) => {
                    if (comment.commentId === commentId) {
                        return {
                            ...comment,
                            likes: updatedLikes,
                            likesBy: [...comment.likesBy, userId],
                        };
                    } else if (comment.replies && comment.replies.length > 0) {
                        return {
                            ...comment,
                            replies: updateLikesInState(comment.replies),
                        };
                    }
                    return comment;
                });
            };

            setComments((prevComments) => {
                const updatedPostComments = updateLikesInState(prevComments[postId]);
                return {
                    ...prevComments,
                    [postId]: updatedPostComments,
                };
            });
            logger.info(`Comment ${commentId} liked`);
        } catch (error) {
            logger.error('Error liking comment:', error);
            throw error;
        }
    }, []);

    // Function to unlike a comment
    const unlikeAComment = useCallback(async (commentId, postId, userId) => {
        try {
            const response = await unlikeComment(commentId);
            const updatedLikes = response.likes;

            const updateLikesInState = (commentsArray) => {
                return commentsArray.map((comment) => {
                    if (comment.commentId === commentId) {
                        return {
                            ...comment,
                            likes: updatedLikes,
                            likesBy: comment.likesBy.filter((id) => id !== userId),
                        };
                    } else if (comment.replies && comment.replies.length > 0) {
                        return {
                            ...comment,
                            replies: updateLikesInState(comment.replies),
                        };
                    }
                    return comment;
                });
            };

            setComments((prevComments) => {
                const updatedPostComments = updateLikesInState(prevComments[postId]);
                return {
                    ...prevComments,
                    [postId]: updatedPostComments,
                };
            });
            logger.info(`Comment ${commentId} unliked`);
        } catch (error) {
            logger.error('Error unliking comment:', error);
            throw error;
        }
    }, []);

    // Function to reply to a comment
    const replyToACommentFunction = useCallback(async (commentId, content, user) => {
        try {
            const replyData = { content };
            const response = await replyToComment(commentId, replyData);
            const newReply = {
                ...response.comment,
                likes: response.comment.likes || 0,
                likesBy: response.comment.likesBy || [],
                replies: [], // Initialize replies
            };

            // Attach user details to the new reply
            newReply.userId = {
                _id: user._id || user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                profilePicture: user.profilePicture,
            };

            const postId = newReply.postId;

            const addReplyToState = (commentsArray) => {
                return commentsArray.map((comment) => {
                    if (comment.commentId === commentId) {
                        return {
                            ...comment,
                            replies: [...(comment.replies || []), newReply],
                        };
                    } else if (comment.replies && comment.replies.length > 0) {
                        return {
                            ...comment,
                            replies: addReplyToState(comment.replies),
                        };
                    }
                    return comment;
                });
            };

            // Update the comments in state
            setComments((prevComments) => {
                const updatedPostComments = addReplyToState(prevComments[postId]);
                return {
                    ...prevComments,
                    [postId]: updatedPostComments,
                };
            });
            logger.info(`Reply added to comment ${commentId}`);
            return newReply;
        } catch (error) {
            logger.error('Error replying to comment:', error);
            throw error;
        }
    }, []);

    // Context values
    const commentContextValue = {
        comments,
        loadingComments,
        loadCommentsForPost,
        errorComments,
    };

    const commentActionsContextValue = {
        addComment,
        updateExistingComment,
        removeComment,
        likeAComment,
        unlikeAComment,
        replyToAComment: replyToACommentFunction,
    };

    return (
        <CommentContext.Provider value={commentContextValue}>
            <CommentUpdateContext.Provider value={commentActionsContextValue}>
                {children}
            </CommentUpdateContext.Provider>
        </CommentContext.Provider>
    );
};

CommentProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export default CommentProvider;