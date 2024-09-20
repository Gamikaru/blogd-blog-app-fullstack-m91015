import React, { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import { useUser } from "../../contexts"; // Import useUser from contexts barrel
import ApiClient from "../../services/api/ApiClient";
import { FaEnvelope, FaBriefcase, FaMapMarkerAlt } from "react-icons/fa";
import Logger from "../../utils/Logger";

export default function Network() {
	const { user } = useUser(); // Access the user from context
	const [users, setUsers] = useState([]); // Store all users
	const [userPosts, setUserPosts] = useState([]); // Store all posts
	const [loading, setLoading] = useState(true); // Combined loading state for users and posts
	const [error, setError] = useState(null); // Error state

	// Refactored useEffect to fetch both users and posts simultaneously
	useEffect(() => {
		Logger.info("Network component mounted, fetching users and posts...");
		fetchData();
	}, []);

	// Function to fetch both users and posts in parallel
	const fetchData = async () => {
		try {
			setLoading(true); // Start loading
			const [usersResponse, postsResponse] = await Promise.all([
				ApiClient.get("/user"), // Fetch users
				ApiClient.get("/post"), // Fetch posts
			]);

			Logger.info("Users fetched:", usersResponse.data);
			Logger.info("Posts fetched:", postsResponse.data);

			setUsers(usersResponse.data); // Set user data
			setUserPosts(postsResponse.data); // Set post data
		} catch (error) {
			Logger.error("Error fetching data:", error);
			setError("Failed to fetch users or posts");
		} finally {
			setLoading(false); // Stop loading after fetching both users and posts
		}
	};

	const getInitials = (first_name, last_name) => {
		return `${first_name.charAt(0)}${last_name.charAt(0)}`;
	};

	const truncatePostContent = (content, limit = 20) => {
		if (!content) return "No content available";
		const words = content.split(" ");
		return words.length > limit ? words.slice(0, limit).join(" ") + "..." : content;
	};

	// Get latest post for a specific user
	const getUserLatestPost = (userId) => {
		return userPosts.find(post => post.userId === userId) || null;
	};

	if (loading) {
		return <div>Loading...</div>;
	}

	if (error) {
		return <div>Error: {error}</div>;
	}

	return (
		<div className="page-container">
			<div className="grid-container">
				{users.length === 0 ? (
					<p>No users found.</p>
				) : (
					users.map(user => (
						<Card key={user._id} className="network-card">
							<Card.Body className="network-card-body">
								<div className="top-section">
									<div className={`initials-circle ${user.status ? "has-status" : ""}`}>
										{getInitials(user.firstName, user.lastName)}
										{user.status && (
											<div className="user-status">
												<div className="status-bubble">
													<span>{user.status}</span>
												</div>
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
							</Card.Body>
						</Card>
					))
				)}
			</div>
		</div>
	);
}
