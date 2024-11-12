// NetworkUserCard.jsx
import { Button } from '@components';
import { motion } from "framer-motion";
import { memo, useMemo, useState } from 'react';
import { Card } from "react-bootstrap";
import { FaBriefcase, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

const NetworkCard = memo(({ user, latestPost, truncatePostContent }) => {
    const [showBubbles, setShowBubbles] = useState(false);

    const getInitials = (firstName, lastName) => {
        return `${firstName.charAt(0)}${lastName.charAt(0)}`;
    };

    const memoizedInitials = useMemo(() =>
        getInitials(user.firstName, user.lastName),
        [user.firstName, user.lastName]
    );

    const memoizedTruncatedContent = useMemo(() =>
        latestPost ? truncatePostContent(latestPost.content) : "No posts yet",
        [latestPost, truncatePostContent]
    );

    const handleEditNetwork = () => {
        // Add your edit network handler here
    };

    const handleSendMessage = () => {
        // Add your send message handler here
    };

    return (
        <Card className="network-card">
            <Card.Body
                className="network-card-body"
                onMouseEnter={() => setShowBubbles(true)}
                onMouseLeave={() => setShowBubbles(false)}
            >
                <div className="top-section">
                    <div className="initials-circle">
                        {memoizedInitials}
                        {user.status && showBubbles && (
                            <div className="bubble-container">
                                <motion.div
                                    className="bubble small-bubble"
                                    initial={{ opacity: 0, scale: 0, y: 0 }}
                                    animate={{ opacity: [0, 1, 1, 0], scale: [0, 1, 1, 0.8], y: [0, -20, -20, -30] }}
                                    transition={{ duration: 7, times: [0, 0.1, 0.85, 1] }}
                                />
                                <motion.div
                                    className="bubble medium-bubble"
                                    initial={{ opacity: 0, scale: 0, y: 0 }}
                                    animate={{ opacity: [0, 1, 1, 0], scale: [0, 1.2, 1.2, 0.8], y: [0, -40, -40, -60] }}
                                    transition={{ duration: 7, times: [0, 0.1, 0.85, 1], delay: 0.2 }}
                                />
                                <motion.div
                                    className="bubble status-bubble"
                                    initial={{ opacity: 0, scale: 0, y: 0 }}
                                    animate={{ opacity: [0, 1, 1, 0], scale: [0, 1, 1, 0.8], y: [0, -60, -60, -90] }}
                                    transition={{ duration: 7, times: [0, 0.1, 0.85, 1], delay: 0.4 }}
                                >
                                    <span>{user.status}</span>
                                </motion.div>
                            </div>
                        )}
                    </div>
                    <div className="user-info">
                        <h5 className="card-title">{`${user.firstName} ${user.lastName}`}</h5>
                        <div className="user-details">
                            <div className="detail-item">
                                <FaEnvelope />
                                <span>{user.email}</span>
                            </div>
                            <div className="detail-item">
                                <FaBriefcase />
                                <span>{user.occupation}</span>
                            </div>
                            <div className="detail-item">
                                <FaMapMarkerAlt />
                                <span>{user.location}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <h6>Latest Post</h6>
                <div className="recent-post">
                    <p className="post-content">
                        {memoizedTruncatedContent}
                    </p>
                </div>
                <Button
                    variant="send"
                    className="button"
                    onClick={handleSendMessage}
                    showIcon={true}
                >
                    Message
                </Button>
            </Card.Body>
        </Card>
    );
});

export default NetworkCard;