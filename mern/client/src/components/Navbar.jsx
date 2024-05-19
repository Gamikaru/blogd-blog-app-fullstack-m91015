// Navbar.jsx
import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { Card, Dropdown, Button } from "react-bootstrap";
import PostModal from "./PostModal"; // Import the PostModal

export default function Navbar({ first_name, last_name }) {
	const location = useLocation();
	const [showModal, setShowModal] = useState(false);

	const handleModal = () => {
		setShowModal(!showModal);
	};

	const handlePostSubmit = (content) => {
		console.log("Post submitted:", content);
		// Add logic to save the post
	};

	// Don't render the navbar on the login and registration pages
	if (location.pathname === "/" || location.pathname === "/register") {
		return null;
	}

	// Combine first name and last name to form the full name
	const userName = `${first_name} ${last_name}`;

	return (
		<>
			<div className="nav-header">
				<nav className="navbar">
					<a href="/home">
						<img
							alt="CodeBloggs logo"
							className="nav-logo-image"
							src="/CodeBloggs logo.png"
						/>
					</a>
					<Button className="post-button" onClick={handleModal}>
						Post
					</Button>
					<div className="dropdown-container">
						<Dropdown>
							<Dropdown.Toggle variant="success" id="dropdown">
								{userName}
							</Dropdown.Toggle>
							<Dropdown.Menu>
								<Dropdown.Item href="/">Account Settings</Dropdown.Item>
								<Dropdown.Item href="/">Logout</Dropdown.Item>
							</Dropdown.Menu>
						</Dropdown>
					</div>
				</nav>
			</div>
			<div className="nav-container">
				<div className="nav">
					<Card>
						<ul>
							<li>
								<a href="/home" className="active">
									Home
								</a>
							</li>
							<li>
								<a href="/bloggs" className="active">
									Bloggs
								</a>
							</li>
							<li>
								<a href="/network" className="active">
									Network
								</a>
							</li>
							<li>
								<a href="/admin" className="active">
									Admin
								</a>
							</li>
						</ul>
					</Card>
				</div>
			</div>
			<PostModal
				show={showModal}
				handleClose={handleModal}
				onSubmit={handlePostSubmit}
			/>
		</>
	);
}
