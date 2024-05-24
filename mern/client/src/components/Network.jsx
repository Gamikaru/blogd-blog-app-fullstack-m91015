import React from "react";
import { Card } from "react-bootstrap";

export default function Network({ user }) {
	// Check if user object is defined
	if (!user) {
		return null; // Return null if user is undefined
	}

	// Destructure user properties with default values
	const {
		first_name = "",
		last_name = "",
		email = "",
		occupation = "",
		location = "",
		status = "",
		latest_post = "",
	} = user;

	// Function to get initials from first and last name
	const getInitials = () => {
		return `${first_name.charAt(0)}${last_name.charAt(0)}`;
	};

	return (
		<Card className="network-card">
			<Card.Body className="network-card-body">
				{/* Initials */}
				<div className="initials">{getInitials()}</div>
				{/* User Information */}
				<div className="user-info">
					<h5>{`${first_name} ${last_name}`}</h5>
					<p>Email: {email}</p>
					<p>Occupation: {occupation}</p>
					<p>Location: {location}</p>
					<p>Status: {status}</p>
				</div>
				{/* Latest Post */}
				<div className="latest-post">
					<h6>Latest Post</h6>
					<p>{latest_post}</p>
				</div>
			</Card.Body>
		</Card>
	);
}
