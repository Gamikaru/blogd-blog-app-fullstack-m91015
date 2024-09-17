// HomePage.jsx
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState, useRef } from "react";
import { Button, Card, Spinner } from "react-bootstrap";
import {
    FaBirthdayCake,
    FaBriefcase,
    FaEnvelope,
    FaMapMarkerAlt,
} from "react-icons/fa";
import PostModal from "./PostModal";
import { useUser } from "../UserContext"; // Import useUser hook
import ApiClient from "../ApiClient"; // Import ApiClient

const UserCard = ({ userInitials, user, updateUserStatus, status, setStatus }) => {
    const formattedBirthdate = new Date(user.birthdate).toLocaleDateString(
        "en-US",
        {
            year: "numeric",
            month: "long",
            day: "numeric",
        }
    );

    // Create a reference to the input element
    const inputRef = useRef(null);

    // Handle the Enter key event to trigger status update and unfocus the input
    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault(); // Prevent form submission or other default actions
            updateUserStatus(status); // Call the function to update the status
            inputRef.current.blur(); // Unfocus the input element
        }
    };

    return (
        <div className="user-card-container">
            <Card className="user-card">
                <div className="user-card-header">
                    <div className="initials-title">{userInitials}</div>
                    <input
                        ref={inputRef} // Attach the ref to the input element
                        className="home-user-status"
                        type="text"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        onBlur={() => updateUserStatus(status)}
                        onKeyDown={handleKeyDown} // Call function on key press
                        placeholder="Update Status"
                    />
                </div>
                <Card.Body className="user-details">
                    <div className="detail-item">
                        <FaEnvelope className="detail-icon" />
                        <span className="detail-text">{user.email}</span>
                    </div>
                    <div className="detail-item">
                        <FaBirthdayCake className="detail-icon" />
                        <span className="detail-text">{formattedBirthdate}</span>
                    </div>
                    <div className="detail-item">
                        <FaBriefcase className="detail-icon" />
                        <span className="detail-text">{user.occupation}</span>
                    </div>
                    <div className="detail-item">
                        <FaMapMarkerAlt className="detail-icon" />
                        <span className="detail-text">{user.location}</span>
                    </div>
                </Card.Body>
            </Card>
        </div>
    );
};

const PostsCard = ({ userPosts, handleLike, likeStatus }) => (
    <div className="home-post-card-container">
        <Card className="home-posts-card">
            <Card.Body>
                <Card.Title className="home-post-title">Your Recent Posts!</Card.Title>
                {userPosts.length > 0 ? (
                    <div className="posts-scroll-container">
                        {userPosts.map((post, index) => (
                            <div key={index} className="post-container">
                                <div className="speech-bubble">
                                    <p className="post-text">{post.content}</p>
                                    <div className="like-info">
                                        <FontAwesomeIcon icon={faHeart} className="like-icon" />
                                        <span className="like-count">{post.likes}</span>
                                    </div>
                                </div>
                                <div className="post-info">
                                    <Button
                                        className="like-button"
                                        onClick={() => handleLike(index)}
                                        disabled={likeStatus[index]}
                                    >
                                        Like
                                    </Button>
                                    <span className="post-date">
                                        {post.time_stamp
                                            ? new Date(post.time_stamp).toLocaleDateString()
                                            : "Date Unavailable"}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>No posts available.</p>
                )}
            </Card.Body>
        </Card>
    </div>
);

export default function HomePage() {
    const { user, setUser } = useUser(); // Use user and setUser from UserContext
    const [userPosts, setUserPosts] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [likeStatus, setLikeStatus] = useState([]); // Track like button status
    const [status, setStatus] = useState(""); // Track status input

    useEffect(() => {
        if (user && user._id) {
            fetchPost();
            setStatus(user.status); // Initialize status input with user's current status
        }
    }, [user]);

    const fetchPost = async () => {
        try {
            const response = await ApiClient.get(`/post/${user._id}`);
            const data = response.data;
            setUserPosts(data);
            setLikeStatus(new Array(data.length).fill(false)); // Initialize likeStatus
        } catch (error) {
            console.error("Error fetching posts:", error);
        }
    };

    const getInitials = (first_name, last_name) => {
        const firstInitial = first_name ? first_name.charAt(0).toUpperCase() : "";
        const lastInitial = last_name ? last_name.charAt(0).toUpperCase() : "";
        return `${firstInitial}${lastInitial}`;
    };

    const userInitials = user ? getInitials(user.first_name, user.last_name) : "";

    const handleLike = async (index) => {
        const postId = userPosts[index]._id;

        try {
            await ApiClient.put(`/post/like/${postId}`);

            // Re-fetch posts to get the updated like count from the server
            await fetchPost();

            const updatedLikeStatus = [...likeStatus];
            updatedLikeStatus[index] = true;
            setLikeStatus(updatedLikeStatus);
        } catch (error) {
            console.error("Error liking post:", error);
        }
    };

    const updateUserStatus = async (newStatus) => {
        try {
            await ApiClient.put(`/user/${user._id}/status`, { status: newStatus });
            setUser((prevUser) => ({ ...prevUser, status: newStatus }));
            console.log("Status updated successfully!");
        } catch (error) {
            console.error("Error updating status:", error);
        }

    };


    if (!user) {
        return <Spinner animation="border" />;
    }

    return (
        <div className="page-container">
            <div className="grid-container">
                <UserCard
                    userInitials={userInitials}
                    user={user}
                    updateUserStatus={updateUserStatus}
                    status={status}
                    setStatus={setStatus}
                />
                <PostsCard
                    userPosts={userPosts}
                    handleLike={handleLike}
                    likeStatus={likeStatus}
                />
            </div>
            <PostModal show={showModal} handleClose={() => setShowModal(false)} />
        </div>
    );
}