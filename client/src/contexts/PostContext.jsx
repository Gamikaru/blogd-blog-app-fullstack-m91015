// src/contexts/PostContext.jsx

import PropTypes from 'prop-types'; // Import prop-Types
import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import {
    createPost,
    deletePostById,
    fetchAllPosts,
    fetchPostsByUser,
    fetchTopLikedPosts,
    likePost,
    unlikePost,
    updatePostById,
} from '../services/api/postService';
import logger from '../utils/logger'; // Ensure logger is imported

export const PostContext = createContext();

export const usePostContext = () => {
    const context = useContext(PostContext);
    if (!context) {
        throw new Error('usePostContext must be used within a PostProvider');
    }
    return context;
};

export const PostProvider = ({ children }) => {
    const [posts, setPosts] = useState([]);
    const [topLikedPosts, setTopLikedPosts] = useState([]);
    const [paginationInfo, setPaginationInfo] = useState({
        totalPosts: 0,
        currentPage: 1,
        totalPages: 1,
    });
    const [loading, setLoading] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null); // Added selectedPost state

    const loadPosts = useCallback(async (page = 1, limit = 25) => {
        setLoading(true);
        try {
            const data = await fetchAllPosts({ page, limit });
            logger.info(`Fetched ${data.posts.length} posts. Each post should include likesBy.`);
            const postsWithId = data.posts.map(post => {
                logger.debug(`Post ID: ${post.postId || post._id}, category: ${post.category}`); // Add category logging
                return {
                    ...post,
                    postId: post.postId || post._id,
                    category: post.category || "Other" // Ensure category is included
                };
            });
            setPosts(postsWithId);
            setPaginationInfo({
                totalPosts: data.totalPosts,
                currentPage: data.currentPage,
                totalPages: data.totalPages,
            });
        } catch (error) {
            logger.error('Error loading posts:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    const refreshPosts = useCallback(async () => {
        await loadPosts();
    }, [loadPosts]);

    const loadTopLikedPosts = useCallback(async () => {
        setLoading(true);
        try {
            const data = await fetchTopLikedPosts();
            const postsWithId = data.map(post => ({
                ...post,
                postId: post.postId || post._id,
            }));
            setTopLikedPosts(postsWithId);
        } catch (error) {
            logger.error('Error loading top liked posts:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    const loadPostsByUser = useCallback(async (userId) => {
        setLoading(true);
        try {
            const data = await fetchPostsByUser(userId);
            setPosts(data.posts);
        } catch (error) {
            logger.error('Error loading user posts:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    const addPost = useCallback(async (formData) => {
        try {
            const newPost = await createPost(formData);
            const postWithId = { ...newPost, postId: newPost.postId || newPost._id };
            setPosts((prevPosts) => [postWithId, ...prevPosts]);
        } catch (error) {
            logger.error('Error adding post:', error);
        }
    }, []);

    const updatePost = useCallback(async (postId, formData) => {
        try {
            const response = await updatePostById(postId, formData);
            const updatedPost = response.post;
            logger.info("Updated post data:", updatedPost); // Add logging
            const postWithId = {
                ...updatedPost,
                postId: updatedPost.postId || updatedPost._id,
                category: updatedPost.category || "Other" // Ensure category is included
            };
            setPosts((prevPosts) =>
                prevPosts.map((post) => (post.postId === postId ? postWithId : post))
            );
            return { success: true, message: response.message };
        } catch (error) {
            logger.error('Error updating post:', error);
            throw error;
        }
    }, [setPosts]);

    const removePost = useCallback(async (postId) => {
        try {
            await deletePostById(postId);
            setPosts((prevPosts) => prevPosts.filter((post) => post.postId !== postId));
        } catch (error) {
            logger.error('Error deleting post:', error);
        }
    }, []);

    const like = useCallback(async (postId) => {
        try {
            const data = await likePost(postId);
            logger.info(`Post ${postId} liked by user.`);
            setPosts((prevPosts) =>
                prevPosts.map((post) =>
                    post.postId === postId
                        ? { ...post, likes: data.likes, likesBy: data.likesBy }
                        : post
                )
            );
        } catch (error) {
            logger.error('Error liking post:', error);
        }
    }, []);

    const unlike = useCallback(async (postId) => {
        try {
            const data = await unlikePost(postId);
            logger.info(`Post ${postId} unliked by user.`);
            setPosts((prevPosts) =>
                prevPosts.map((post) =>
                    post.postId === postId
                        ? { ...post, likes: data.likes, likesBy: data.likesBy }
                        : post
                )
            );
        } catch (error) {
            logger.error('Error unliking post:', error);
        }
    }, []);

    const contextValue = useMemo(
        () => ({
            posts,
            setPosts,
            topLikedPosts,
            paginationInfo,
            loading,
            loadPosts,
            loadTopLikedPosts,
            addPost,
            updatePost,
            removePost,
            like,
            unlike,
            selectedPost,       // Provided selectedPost
            setSelectedPost,    // Provided setSelectedPost
            refreshPosts,       // Provided refreshPosts
            loadPostsByUser,    // Provided loadPostsByUser
        }),
        [
            posts,
            selectedPost,
            refreshPosts,
            topLikedPosts,
            paginationInfo,
            loading,
            loadPosts,
            loadTopLikedPosts,
            addPost,
            updatePost,
            removePost,
            like,
            unlike,
            loadPostsByUser,
        ]
    );

    return <PostContext.Provider value={contextValue}>{children}</PostContext.Provider>;
};

PostProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
