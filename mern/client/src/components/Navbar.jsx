import React, { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Card, Dropdown, Button, Modal } from "react-bootstrap";
import PostModal from "./PostModal";
import { useCookies } from "react-cookie";

export default function Navbar() {
	const [cookie, setCookie, removeCookie] = useCookies();
	const location = useLocation();
	const navigate = useNavigate();
	const [showModal, setShowModal] = useState(false);
	const [showAccountModal, setShowAccountModal] = useState(false);
	const [showDropdown, setShowDropdown] = useState(false);
	const dropdownRef = useRef(null);

	const [user, setUser] = useState({
		first_name: "",
		last_name: "",
		status: "",
		email: "",
		birthdate: "",
		occupation: "",
		location: "",
		auth_level: "", // Add auth_level to the user state
	});

	useEffect(() => {
		fetchUser();
	}, []);

	const fetchUser = async () => {
		const token = cookie.PassBloggs;
		if (!token) {
			console.error("Token not found in cookies");
			return;
		}
		try {
			const response = await fetch(
				`http://localhost:5050/user/${cookie.userID}`,
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
			setUser(data);
		} catch (error) {
			console.error("Error fetching user data:", error);
		}
	};

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
				setShowDropdown(false);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	const handleModal = () => {
		setShowModal(!showModal);
	};

	const handleAccountModal = () => {
		setShowAccountModal(!showAccountModal);
	};

	const handleDropdown = () => {
		setShowDropdown(!showDropdown);
	};

	const handlePostSubmit = (content) => {
		console.log("Post submitted:", content);
	};

	const handleLogout = () => {
		removeCookie("PassBloggs", { path: "/" });
		removeCookie("userID", { path: "/" });
		window.location.href = "/login";
		navigate("/login");
	};

	// Don't render the navbar on the login and registration pages
	if (location.pathname === "/login" || location.pathname === "/register") {
		return null;
	}

	// Combine first name and last name to form the full name
	const userName = `${user.first_name} ${user.last_name}`;

	return (
		<>
			<div className="nav-header">
				<nav className="navbar">
					<a href="/">
						<img
							alt="CodeBloggs logo"
							className="nav-logo-image"
							src="/CodeBloggs logo.png"
						/>
					</a>
					<Button className="post-button" onClick={handleModal}>
						Post
					</Button>
					<div className="dropdown-container" ref={dropdownRef}>
						<Dropdown
							show={showDropdown}
							onClose={() => setShowDropdown(false)}
						>
							<Dropdown.Toggle id="dropdown" onClick={handleDropdown}>
								{userName}
							</Dropdown.Toggle>
							<Dropdown.Menu>
								<Dropdown.Item onClick={handleAccountModal}>
									Account Settings
								</Dropdown.Item>
								<Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
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
								<a href="/" className="active">
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
							{user.auth_level === "admin" && ( // Conditionally render the Admin link
								<li>
									<a href="/admin" className="active">
										Admin
									</a>
								</li>
							)}
						</ul>
					</Card>
				</div>
			</div>
			<PostModal
				show={showModal}
				handleClose={handleModal}
				onSubmit={handlePostSubmit}
			/>
			<Modal
				className="nav-toast-container"
				show={showAccountModal}
				onHide={handleAccountModal}
				centered
			>
				<Modal.Title className="nav-toast-title">Account Settings</Modal.Title>
				<Modal.Body className="nav-toast-mssg">
					<p>Go to Account Setting.</p>
				</Modal.Body>
				<Modal.Footer>
					<Button className="nav-toast-button" onClick={handleAccountModal}>
						Confirm
					</Button>
				</Modal.Footer>
			</Modal>
		</>
	);
}
