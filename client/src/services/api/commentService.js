// src/services/api/CommentService.js

import ApiClient from './ApiClient';

// Function to create a new comment
export const createComment = async (commentData) => {
    const response = await ApiClient.post('/comment/', commentData);
    return response.data;
};

// Function to get comments for a specific post
export const fetchCommentsByPostId = async (postId) => {
    const response = await ApiClient.get(`/comment/comments/${postId}`);
    return response.data;
};

// Function to get a single comment by ID
export const fetchCommentById = async (commentId) => {
    const response = await ApiClient.get(`/comment/${commentId}`);
    return response.data;
};

// Function to update a comment by ID
export const updateComment = async (commentId, updatedData) => {
    const response = await ApiClient.patch(`/comment/${commentId}`, updatedData);
    return response.data;
};

// Function to delete a comment by ID
export const deleteComment = async (commentId) => {
    const response = await ApiClient.delete(`/comment/${commentId}`);
    return response.data;
};

// Function to like a comment by ID
export const likeComment = async (commentId) => {
    const response = await ApiClient.put(`/comment/like/${commentId}`);
    return response.data; // Should return { likes: number, commentId: string }
};

// Function to unlike a comment by ID
export const unlikeComment = async (commentId) => {
    const response = await ApiClient.put(`/comment/unlike/${commentId}`);
    return response.data; // Should return { likes: number, commentId: string }
};

// Function to reply to a comment by parent comment ID
export const replyToComment = async (commentId, replyData) => {
    const response = await ApiClient.post(`/comment/reply/${commentId}`, replyData);
    return response.data; // Should return { success: boolean, comment: object }
};