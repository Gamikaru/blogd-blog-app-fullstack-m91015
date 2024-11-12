// Network.jsx
import { NetworkCard } from '@components';
import { useUser } from '@contexts';
import { ApiClient } from '@services/api';
import { motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


const Network = () => {
    const { user } = useUser();
    const [users, setUsers] = useState([]);
    const [userPosts, setUserPosts] = useState({});  // Change to object for O(1) lookup
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                // Fetch users first, then fetch posts only for visible users
                const usersResponse = await ApiClient.get("/user");
                setUsers(usersResponse.data);

                // Batch post fetching for visible users
                const visibleUsers = usersResponse.data.slice(0, 10); // Limit initial load
                const postsResponse = await ApiClient.get("/post");

                // Create lookup object
                const postsLookup = postsResponse.data.reduce((acc, post) => {
                    if (!acc[post.userId]) {
                        acc[post.userId] = [];
                    }
                    acc[post.userId].push(post);
                    return acc;
                }, {});

                setUserPosts(postsLookup);
            } catch (error) {
                setError("Failed to fetch data");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const truncatePostContent = (content, limit = 20) => {
        if (!content) return "No content available";
        const temp = document.createElement("div");
        temp.innerHTML = content;
        const text = temp.textContent || temp.innerText || "";
        const words = text.split(" ");
        return words.length > limit
            ? words.slice(0, limit).join(" ") + "..."
            : text;
    };

    // Memoize getUserLatestPost
    const getUserLatestPost = useCallback((userId) => {
        const userPostList = userPosts[userId] || [];
        return userPostList.length > 0
            ? userPostList.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0]
            : null;
    }, [userPosts]);

    const handleUserClick = (userId) => {
        navigate(`/profile/${userId}`);
    };

    // Animation Variants
    const containerVariants = {
        hidden: { opacity: 1 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.3, ease: "easeOut" },
        },
    };

    if (loading) {
        return <div className="loading-message">Loading...</div>;
    }

    if (error) {
        return <div className="error-message">Error: {error}</div>;
    }

    return (
        <div className="network-page-container">
            <motion.div
                className="grid-container network-grid"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {users.length === 0 ? (
                    <p>No users found.</p>
                ) : (
                    users.map((user) => (
                        <motion.div
                            className="grid-item"
                            key={user.userId}
                            variants={cardVariants}
                        >
                            <div
                                className="user-card"
                                onClick={() => handleUserClick(user.userId)}
                                style={{ cursor: 'pointer' }}
                            >
                                <NetworkCard
                                    user={user}
                                    getUserLatestPost={getUserLatestPost}
                                    truncatePostContent={truncatePostContent}
                                />
                            </div>
                        </motion.div>
                    ))
                )}
            </motion.div>
        </div>
    );
};

export default Network;