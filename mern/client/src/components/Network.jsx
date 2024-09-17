import React, { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import { useUser } from "../UserContext";
import ApiClient from "../ApiClient";
import { FaEnvelope, FaBriefcase, FaMapMarkerAlt } from "react-icons/fa";

export default function Network() {
	const { user } = useUser(); // Access the user from context
	const [users, setUsers] = useState([]);
	const [userPosts, setUserPosts] = useState({});

	useEffect(() => {
		if (user) {
			fetchUsers();
		}
	}, [user]);

	const fetchUsers = async () => {
		try {
			const response = await ApiClient.get(`/user`);
			setUsers(response.data);
			response.data.forEach((user) => fetchUserPost(user._id));
		} catch (error) {
			console.error("Error fetching users:", error);
		}
	};

	const fetchUserPost = async (userId) => {
		try {
			const response = await ApiClient.get(`/post/${userId}`);
			const latestPost =
				response.data.length > 0 ? response.data[response.data.length - 1] : null;
			setUserPosts((prevState) => ({
				...prevState,
				[userId]: latestPost,
			}));
		} catch (error) {
			console.error(`Error fetching posts for user ${userId}:`, error);
		}
	};

	const getInitials = (first_name, last_name) => {
		if (first_name && last_name) {
			return `${first_name.charAt(0)}${last_name.charAt(0)}`;
		}
		return "";
	};

	const truncatePostContent = (content, limit = 20) => {
		const words = content.split(" ");
		return words.length > limit ? words.slice(0, limit).join(" ") + "..." : content;
	};

	return (
		<div className="page-container">
			<div className="grid-container">
				{users.map((user) => (
					<Card key={user._id} className="network-card">
						<Card.Body className="network-card-body">
							<div className="top-section">
								<div
									className={`initials-circle ${user.status ? "has-status" : ""
										}`}
								>
									{getInitials(user.first_name, user.last_name)}
									{/* Conditionally render .user-status if user.status is not empty */}
									{user.status && (
										<div className="user-status">
											<div className="status-bubble">
												<span>{user.status}</span>
											</div>
										</div>
									)}
								</div>
								<div className="user-info">
									<h5 className="card-title">{`${user.first_name} ${user.last_name}`}</h5>
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
							{/* Move the "Latest Post" heading outside the recent-post div */}
							<h6>Latest Post</h6>
							<div className="recent-post">
								{userPosts[user._id] ? (
									<p className="post-content">
										{truncatePostContent(userPosts[user._id].content)}
									</p>
								) : (
									<p>No posts yet</p>
								)}
							</div>
						</Card.Body>
					</Card>
				))}
			</div>
		</div>
	);
}
