// src/contexts/PostContext.jsx

import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import {
    createPost,
    deletePostById,
    fetchAllPosts,
    fetchTopLikedPosts,
    likePost,
    unlikePost,
    updatePostById,
} from '../services/api/PostService';

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

    const loadPosts = useCallback(async (page = 1, limit = 10) => {
        setLoading(true);
        try {
            const data = await fetchAllPosts({ page, limit });
            const postsWithId = data.posts.map(post => ({
                ...post,
                postId: post.postId || post._id,
            }));
            setPosts(postsWithId);
            setPaginationInfo({
                totalPosts: data.totalPosts,
                currentPage: data.currentPage,
                totalPages: data.totalPages,
            });
        } catch (error) {
            console.error('Error loading posts:', error);
        } finally {
            setLoading(false);
        }
    }, []);

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
            console.error('Error loading top liked posts:', error);
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
            console.error('Error adding post:', error);
        }
    }, []);

    const updatePost = useCallback(async (postId, formData) => {
        try {
            const updatedPost = await updatePostById(postId, formData);
            const postWithId = { ...updatedPost, postId: updatedPost.postId || updatedPost._id };
            setPosts((prevPosts) =>
                prevPosts.map((post) => (post.postId === postId ? postWithId : post))
            );
        } catch (error) {
            console.error('Error updating post:', error);
        }
    }, []);

    const removePost = useCallback(async (postId) => {
        try {
            await deletePostById(postId);
            setPosts((prevPosts) => prevPosts.filter((post) => post.postId !== postId));
        } catch (error) {
            console.error('Error deleting post:', error);
        }
    }, []);

    const like = useCallback(async (postId) => {
        try {
            const data = await likePost(postId);
            setPosts((prevPosts) =>
                prevPosts.map((post) =>
                    post.postId === postId ? { ...post, likes: data.likes, likesBy: data.likesBy } : post
                )
            );
        } catch (error) {
            console.error('Error liking post:', error);
        }
    }, []);

    const unlike = useCallback(async (postId) => {
        try {
            const data = await unlikePost(postId);
            setPosts((prevPosts) =>
                prevPosts.map((post) =>
                    post.postId === postId ? { ...post, likes: data.likes, likesBy: data.likesBy } : post
                )
            );
        } catch (error) {
            console.error('Error unliking post:', error);
        }
    }, []);

    const contextValue = useMemo(
        () => ({
            posts,
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
        }),
        [
            posts,
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
        ]
    );

    return <PostContext.Provider value={contextValue}>{children}</PostContext.Provider>;
};
