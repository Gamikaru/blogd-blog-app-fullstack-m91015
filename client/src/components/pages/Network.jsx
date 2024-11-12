// Network.jsx
import { NetworkCard } from '@components';
import { useUser } from '@contexts';
import UserService from '@services/api/UserService';
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Network = () => {
    const { user, loading: userLoading } = useUser();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            if (!user) {
                setError("User not authenticated");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                // Use userId or fallback to _id
                const currentUserId = user.userId || user._id;
                const usersData = await UserService.fetchUsersExcept(currentUserId);
                setUsers(usersData);
            } catch (error) {
                setError("Failed to fetch users");
                console.error('Fetch Error:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user]);

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

    if (loading || userLoading) {
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