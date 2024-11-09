// NetworkUserCard.jsx
import { Button } from '@components';
import { motion, useAnimation } from "framer-motion";
import React from "react";
import { Card } from "react-bootstrap";
import { FaBriefcase, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

const NetworkCard = ({ user, getUserLatestPost, truncatePostContent }) => {
    // Animation controls for bubbles
    const smallBubbleControls = useAnimation();
    const mediumBubbleControls = useAnimation();
    const statusBubbleControls = useAnimation();

    const getInitials = (firstName, lastName) => {
        return `${firstName.charAt(0)}${lastName.charAt(0)}`;
    };

    // Bubbles Animation Variants
    const smallBubbleVariants = {
        hidden: { opacity: 0, scale: 0, y: 0 },
        visible: {
            opacity: [0, 1, 1, 0],
            scale: [0, 1, 1, 0.8],
            y: [0, -20, -20, -30],
            transition: {
                duration: 7, // Total duration
                times: [0, 0.1, 0.85, 1],
            },
        },
    };

    const mediumBubbleVariants = {
        hidden: { opacity: 0, scale: 0, y: 0 },
        visible: {
            opacity: [0, 1, 1, 0],
            scale: [0, 1.2, 1.2, 0.8],
            y: [0, -40, -40, -60],
            transition: {
                duration: 7,
                times: [0, 0.1, 0.85, 1],
                delay: 0.2, // Slight delay for staggered effect
            },
        },
    };

    const statusBubbleVariants = {
        hidden: { opacity: 0, scale: 0, y: 0 },
        visible: {
            opacity: [0, 1, 1, 0],
            scale: [0, 1, 1, 0.8],
            y: [0, -60, -60, -90],
            transition: {
                duration: 7,
                times: [0, 0.1, 0.85, 1],
                delay: 0.4, // Slight delay for staggered effect
            },
        },
    };

    // Handle hover start
    const handleHoverStart = () => {
        if (user.status) {
            smallBubbleControls.start("visible");
            mediumBubbleControls.start("visible");
            statusBubbleControls.start("visible");
        }
    };

    // Handle hover end
    const handleHoverEnd = () => {
        smallBubbleControls.stop();
        mediumBubbleControls.stop();
        statusBubbleControls.stop();
        smallBubbleControls.set("hidden");
        mediumBubbleControls.set("hidden");
        statusBubbleControls.set("hidden");
    };

    return (
        <Card className="network-card">
            <Card.Body
                className="network-card-body"
                onMouseEnter={handleHoverStart}
                onMouseLeave={handleHoverEnd}
            >
                <div className="top-section">
                    <div className="initials-circle">
                        {getInitials(user.firstName, user.lastName)}
                        {user.status && (
                            <div className="bubble-container">
                                <motion.div
                                    className="bubble small-bubble"
                                    variants={smallBubbleVariants}
                                    initial="hidden"
                                    animate={smallBubbleControls}
                                />
                                <motion.div
                                    className="bubble medium-bubble"
                                    variants={mediumBubbleVariants}
                                    initial="hidden"
                                    animate={mediumBubbleControls}
                                />
                                <motion.div
                                    className="bubble status-bubble"
                                    variants={statusBubbleVariants}
                                    initial="hidden"
                                    animate={statusBubbleControls}
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
                    {getUserLatestPost(user._id) ? (
                        <p className="post-content">
                            {truncatePostContent(getUserLatestPost(user._id).content)}
                        </p>
                    ) : (
                        <p>No posts yet</p>
                    )}
                </div>
                <Button
                    variant="edit"
                    showIcon={false} // Toggle icon off if desired
                    onClick={() => {/* Add your edit profile handler here */}}
                    className="network-card-edit-button"
                >
                    Edit Profile
                </Button>
                {/* Example of a button with an icon */}
                <Button
                    variant="send"
                    showIcon={true} // Icon is shown
                    onClick={() => {/* Add your send message handler here */}}
                    className="network-card-send-button"
                >
                    Send Message
                </Button>
            </Card.Body>
        </Card>
    );
};

export default NetworkCard;