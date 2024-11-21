// src/contexts/CommentContext.jsx


import { createComment, deleteComment, fetchCommentsByPostId, likeComment, replyToComment, unlikeComment, updateComment, } from '@services/api';
import { logger } from '@utils';
import PropTypes from 'prop-types';
import { createContext, useCallback, useContext, useState } from 'react';

// Create contexts
const CommentContext = createContext(); const CommentUpdateContext = createContext();

// Custom hooks for using the contexts
export const useComments = () => useContext(CommentContext);
export const useCommentActions = () => useContext(CommentUpdateContext);

// Provider component
export const CommentProvider = ({ children }) => {
    const [comments, setComments] = useState({}); const [loadingComments, setLoadingComments] = useState(false); const [errorComments, setErrorComments] = useState(null);
    // Removed the unused 'user' variable
    // const { user } = useUser(); // No longer needed

    // Function to fetch comments for a post
    const loadCommentsForPost = useCallback(async (postId) => {
        setLoadingComments(true);
        setErrorComments(null);
        try {
            const fetchedComments = await fetchCommentsByPostId(postId);
            setComments((prev) => ({
                ...prev,
                [postId]: fetchedComments,
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
    const addComment = useCallback(async (postId, content) => {
        try {
            const commentData = { content, postId };
            const newCommentResponse = await createComment(commentData);
            const newComment = newCommentResponse.comment;
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
    }, []); // Removed 'user' from dependencies

    // Function to update a comment
    const updateExistingComment = useCallback(async (commentId, content) => {
        try {
            const updatedData = { content };
            const updatedCommentResponse = await updateComment(commentId, updatedData);
            const updatedComment = updatedCommentResponse.comment;
            // Update the comment in state
            setComments((prevComments) => {
                const postId = updatedComment.postId;
                const updatedPostComments = prevComments[postId].map((comment) =>
                    comment._id === commentId ? updatedComment : comment
                );
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
            setComments((prevComments) => {
                const updatedPostComments = prevComments[postId].filter(
                    (comment) => comment._id !== commentId
                );
                return {
                    ...prevComments,
                    [postId]: updatedPostComments,
                };
            });
            logger.info(`Comment ${commentId} deleted from post ${postId}`);
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
            // Update the likes and likesBy in state
            setComments((prevComments) => {
                const updatedPostComments = prevComments[postId].map((comment) =>
                    comment._id === commentId
                        ? {
                            ...comment,
                            likes: updatedLikes,
                            likesBy: [...comment.likesBy, userId], // Add userId
                        }
                        : comment
                );
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
            // Update the likes and likesBy in state
            setComments((prevComments) => {
                const updatedPostComments = prevComments[postId].map((comment) =>
                    comment._id === commentId
                        ? {
                            ...comment,
                            likes: updatedLikes,
                            likesBy: comment.likesBy.filter(id => id !== userId), // Remove userId
                        }
                        : comment
                );
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
    const replyToAComment = useCallback(async (commentId, content) => {
        try {
            const replyData = { content };
            const response = await replyToComment(commentId, replyData);
            const newReply = response.comment;
            const postId = newReply.postId;
            // Update the comments in state
            setComments((prevComments) => {
                const updatedPostComments = prevComments[postId].map((comment) => {
                    if (comment._id === commentId) {
                        return {
                            ...comment,
                            replies: [...comment.replies, newReply],
                        };
                    }
                    return comment;
                });
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
        errorComments, // Added errorComments
    };

    const commentActionsContextValue = {
        addComment,
        updateExistingComment,
        removeComment,
        likeAComment,
        unlikeAComment,
        replyToAComment,
    };

    return (
        <CommentContext.Provider value={commentContextValue}>
            <CommentUpdateContext.Provider value={commentActionsContextValue}>
                {children}
            </CommentUpdateContext.Provider>
        </CommentContext.Provider>
    );

};

CommentProvider.propTypes = { children: PropTypes.node.isRequired, };

export default CommentProvider;