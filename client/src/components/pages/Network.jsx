// Network.jsx
import { ApiClient, Button, Logger, NetworkCard, useUser } from '@components';
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Network() {
    const { user } = useUser();
    const [users, setUsers] = useState([]);
    const [userPosts, setUserPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        Logger.info("Network component mounted, fetching users and posts...");
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [usersResponse, postsResponse] = await Promise.all([
                ApiClient.get("/user"),
                ApiClient.get("/post"),
            ]);

            Logger.info("Users fetched:", usersResponse.data);
            Logger.info("Posts fetched:", postsResponse.data);

            setUsers(usersResponse.data);
            setUserPosts(postsResponse.data);
        } catch (error) {
            Logger.error("Error fetching data:", error);
            setError("Failed to fetch users or posts");
        } finally {
            setLoading(false);
        }
    };

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

    const getUserLatestPost = (userId) => {
        const posts = userPosts
            .filter((post) => post.userId === userId)
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        return posts.length > 0 ? posts[0] : null;
    };

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
                            key={user._id}
                            variants={cardVariants}
                        >
                            <div
                                className="user-card"
                                onClick={() => handleUserClick(user._id)}
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
}
