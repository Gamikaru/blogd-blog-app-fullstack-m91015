import React from "react";
import { Card } from "react-bootstrap";

export default function Network() {
	const users = [
		{
			id: "",
			first_name: "",
			last_name: "",
			email: "",
			occupation: "",
			location: "",
			status: "",
			latest_post: "",
		},
	];

	const getInitials = (first_name, last_name) => {
		if (first_name && last_name) {
			return `${first_name.charAt(0)}${last_name.charAt(0)}`;
		}
		return "";
	};

	return (
		<div className="network-container">
			{users.map((user) => (
				<Card key={user.id} className="network-card">
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
							<h6>Latest Post</h6>
							<p>{user.latest_post}</p>
						</div>
					</Card.Body>
				</Card>
			))}
		</div>
	);
}
