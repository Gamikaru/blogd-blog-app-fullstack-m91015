import React, { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import { useCookies } from "react-cookie";
import { FaBirthdayCake, FaBriefcase, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

import PostModal from "./PostModal";

// import "../styles/global/_layout.scss";
import "../styles/custom_component_styles/home_page.scss";


const UserCard = ({ userInitials, user, updateUserStatus }) => {
    // Format birthdate for a more user-friendly display
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

const PostsCard = ({ userPosts, handleLike }) => (
    <div className="home-post-card-container">
        <Card className="home-posts-card">
            <Card.Body>
                <Card.Title className="home-post-title">Your Recent Posts!</Card.Title>
                {userPosts.length > 0 ? (
                    userPosts.map((post, index) => (
                        <div key={index}>
                            <p className="home-post-content">{post.content}</p>
                            <p>{new Date(post.postDate).toLocaleDateString()}</p>
                            <p className="home-post-likes">Likes: {post.likes}</p>
                            <button className="like-button" onClick={() => handleLike(index)}>
                                Like
                            </button>
                        </div>
                    ))
                ) : (
                    <p>No posts available.</p>
                )}
            </Card.Body>
        </Card>
    </div>
);

export default function HomePage() {
    const [cookie] = useCookies();
    const [user, setUser] = useState({
        first_name: "",
        last_name: "",
        status: "",
        email: "",
        birthdate: "",
        occupation: "",
        location: "",
    });
    const [userPosts, setUserPosts] = useState([]);
    const [showModal, setShowModal] = useState(false);

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
        } catch (error) {
            console.error("Error fetching posts:", error);
        }
    };

    const getInitials = (first_name, last_name) => {
        const firstInitial = first_name ? first_name.charAt(0).toUpperCase() : "";
        const lastInitial = last_name ? last_name.charAt(0).toUpperCase() : "";
        return `${firstInitial}${lastInitial}`;
    };

    const userInitials = getInitials(user.first_name, user.last_name);

    const handleLike = (index) => {
        setUserPosts((prevPosts) => {
            const updatedPosts = [...prevPosts];
            updatedPosts[index].likes += 1;
            return updatedPosts;
        });
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

    return (
        <div className="page-container">
            <div className="grid-container">
                <UserCard
                    userInitials={userInitials}
                    user={user}
                    updateUserStatus={updateUserStatus}
                />
                <PostsCard userPosts={userPosts} handleLike={handleLike} />
            </div>
            <PostModal show={showModal} handleClose={() => setShowModal(false)} />
        </div>
    );
}
