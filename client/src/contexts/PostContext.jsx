import { Logger, createPost, fetchPostsByUser, likePost } from '@components';
import { createContext, useCallback, useContext, useState } from 'react';

// Create PostContext
const PostContext = createContext();

// Custom hook to use PostContext
const usePostContext = () => useContext(PostContext);

// Provider component to wrap parts of the app that need post management
const PostProvider = ({ children }) => {
    const [posts, setPosts] = useState([]);

    const refreshPosts = useCallback(async () => {
        try {
            const fetchedPosts = await fetchPostsByUser();
            setPosts(fetchedPosts);
        } catch (error) {
            Logger.error('Error fetching posts:', error);
        }
    }, []);

    const handleCreatePost = async (formData) => {
        try {
            await createPost(formData);
            refreshPosts(); // Ensure the new post is reflected in UI
        } catch (error) {
            Logger.error('Error creating post:', error);
        }
    };

    // Handle liking a post
    const handleLike = async (postId, userId) => {
        Logger.info('Liking post with ID:', postId, 'by user with ID:', userId);
        try {
            await likePost(postId); // Send the like request
            const updatedPosts = posts.map(post =>
                post._id === postId
                    ? { ...post, likes: post.likes + 1, likesBy: [...post.likesBy, userId] }
                    : post
            );
            setPosts(updatedPosts); // Update the post with the new like count
            setLikeStatus((prev) => ({ ...prev, [postId]: [...prev[postId], userId] })); // Mark as liked by the user
            Logger.info('Liked post successfully with ID:', postId);
        } catch (error) {
            Logger.error('Error liking post with ID:', postId, error);
        }
    };

    return (
        <PostContext.Provider value={{ posts, handleCreatePost, handleLike, refreshPosts }}>
            {children}
        </PostContext.Provider>
    );
};

export default PostProvider;
export { usePostContext };
