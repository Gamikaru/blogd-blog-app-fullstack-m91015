import React, { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import { useCookies } from "react-cookie";

export default function Network() {
	const [cookie, setCookie, removeCookie] = useCookies();
	const [users, setUsers] = useState([]);
	const [userPosts, setUserPosts] = useState([]);

	useEffect(() => {
		fetchUsers();
		fetchPost();
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
		} catch (error) {
			console.error("Error fetching users:", error);
		}
	};

	const fetchPost = async () => {
		const token = cookie.PassBloggs;
		if (!token) {
			console.error("Token not found in localStorage");
			return;
		}
		try {
			const response = await fetch(
				`http://localhost:5050/post/${cookie.userID}`,
				{
					headers: {
					Authorization: `Bearer ${token}`,
					},
				}
			);
			if (!response.ok) {
				throw new Error(`Failed to fetch user data: ${response.statusText}`);
			}
			const data = await response.json();
			console.log(data);
			setUserPosts(data);
		} catch (error) {
			console.error("Error fetching user data:", error);
		}
	};

	const getInitials = (first_name, last_name) => {
		if (first_name && last_name) {
			return `${first_name.charAt(0)}${last_name.charAt(0)}`;
		}
		return "";
	};

	return (
		<div className="network-container">
			{users.map((user) => (
				<Card key={user._id} className="network-card">
					<Card.Body className="network-card-body">
						<div className="top-section">
							<div className="initials">
								{getInitials(user.first_name, user.last_name)}
							</div>
							<div className="user-info">
								<h5>{`${user.first_name} ${user.last_name}`}</h5>
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
							{userPosts.map((post) => (
								<p key={post._id}>{post.content}</p>
							))}
						</div>
					</Card.Body>
				</Card>
			))}
		</div>
	);
}
