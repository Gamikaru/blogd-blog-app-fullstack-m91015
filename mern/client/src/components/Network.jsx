import React, { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import { useCookies } from "react-cookie";


export default function Network() {
	const [cookie] = useCookies(["PassBloggs"]);
	const [users, setUsers] = useState([]);
	const [userPosts, setUserPosts] = useState({});

	useEffect(() => {
		fetchUsers();
	}, []);

	const fetchUsers = async () => {
		const token = cookie.PassBloggs;
		try {
			const response = await fetch(`http://localhost:5050/user`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			});
			if (!response.ok) {
				throw new Error("Network response was not ok");
			}
			const data = await response.json();
			setUsers(data);
			data.forEach((user) => fetchUserPost(user._id, token));
		} catch (error) {
			console.error("Error fetching users:", error);
		}
	};

	const fetchUserPost = async (userId, token) => {
		try {
			const response = await fetch(`http://localhost:5050/post/${userId}`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			if (!response.ok) {
				throw new Error(`Failed to fetch user posts: ${response.statusText}`);
			}
			const data = await response.json();
			const latestPost = data.length > 0 ? data[data.length - 1] : null;
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

	return (
		<div className="page-container">
			<div className="grid-container">
				{users.map((user) => (
					<Card key={user._id} className="card-container network-card">
						<Card.Body className="network-card-body">
							<div className="top-section">
								<div className="initials-circle">{getInitials(user.first_name, user.last_name)}</div>
								<div className="user-info">
									<h5 className="card-title">{`${user.first_name} ${user.last_name}`}</h5>
									<p>Email: {user.email}</p>
									<p>Occupation: {user.occupation}</p>
									<p>Location: {user.location}</p>
								</div>
							</div>
							<div className="user-status">
								<p>Status: {user.status}</p>
							</div>
							<div className="recent-post">
								<h6>Latest Post:</h6>
								{userPosts[user._id] ? (
									<p>{userPosts[user._id].content}</p>
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
