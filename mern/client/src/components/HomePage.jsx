import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { Button, Card, Spinner } from "react-bootstrap";
import { useCookies } from "react-cookie";
import { FaBirthdayCake, FaBriefcase, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import PostModal from "./PostModal";


const UserCard = ({ userInitials, user, updateUserStatus }) => {
    const formattedBirthdate = new Date(user.birthdate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <div className="user-card-container">
            <Card className="user-card">
                <div className="user-card-header">
                    <div className="initials-title">{userInitials}</div>
                    <input
                        className="home-user-status"
                        type="text"
                        value={user.status}
                        onChange={(e) => updateUserStatus(e.target.value)}
                        placeholder="Update Status"
                    />
                </div>
                <Card.Body>
                    <div className="user-details">
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
                    <div className="posts-scroll-container"> {/* Added scroll container here */}
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
    const [cookie] = useCookies();
    const [user, setUser] = useState(null);
    const [userPosts, setUserPosts] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [likeStatus, setLikeStatus] = useState([]); // Track like button status

    useEffect(() => {
        fetchUser();
        fetchPost();
    }, []);

    const fetchUser = async () => {
        const token = cookie.PassBloggs;
        if (!token) {
            console.error("Token not found");
            return;
        }
        try {
            const response = await fetch(`http://localhost:5050/user/${cookie.userID}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!response.ok) throw new Error(`Failed to fetch user data: ${response.statusText}`);
            const data = await response.json();
            setUser(data);
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    };

    const fetchPost = async () => {
        const token = cookie.PassBloggs;
        if (!token) {
            console.error("Token not found");
            return;
        }
        try {
            const response = await fetch(`http://localhost:5050/post/${cookie.userID}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!response.ok) throw new Error(`Failed to fetch posts: ${response.statusText}`);
            const data = await response.json();
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
        const postId = userPosts[index]._id;  // Assuming each post has an _id from the backend

        try {
            // Optimistically update the frontend to reflect the new like count immediately
            setUserPosts((prevPosts) => {
                const updatedPosts = [...prevPosts];
                updatedPosts[index].likes += 1; // Optimistically increase the like count
                return updatedPosts;
            });

            // Call the backend to increment the like count
            const response = await fetch(`http://localhost:5050/post/like/${postId}`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${cookie.PassBloggs}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to like post');
            }

            // After the like operation succeeds, re-fetch the posts to get the latest data
            await fetchPost();  // This will ensure that the UI has the most up-to-date like count

            // Optionally, you can disable the like button after a successful like
            const updatedLikeStatus = [...likeStatus];
            updatedLikeStatus[index] = true;
            setLikeStatus(updatedLikeStatus);

        } catch (error) {
            console.error("Error liking post:", error);

            // Rollback optimistic UI update if there was an error
            setUserPosts((prevPosts) => {
                const updatedPosts = [...prevPosts];
                updatedPosts[index].likes -= 1; // Revert the like count if there was an error
                return updatedPosts;
            });
        }
    };



    const updateUserStatus = async (newStatus) => {
        try {
            const token = cookie.PassBloggs;
            if (!token) {
                console.error("Token not found");
                return;
            }
            const response = await fetch(`http://localhost:5050/user/${cookie.userID}`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ status: newStatus }),
            });
            if (!response.ok) throw new Error(`Failed to update status: ${response.statusText}`);
            setUser((prevUser) => ({ ...prevUser, status: newStatus }));
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
                />
                <PostsCard userPosts={userPosts} handleLike={handleLike} likeStatus={likeStatus} />
            </div>
            <PostModal show={showModal} handleClose={() => setShowModal(false)} />
        </div>
    );
}
