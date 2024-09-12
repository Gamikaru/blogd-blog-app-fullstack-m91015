import React, { useEffect, useRef, useState } from "react";
import { Button, Dropdown, Modal } from "react-bootstrap";
import { useCookies } from "react-cookie";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../styles/navbar.css";
import "../styles/sidebar";
import PostModal from "./PostModal";

export default function Navbar() {
	const [cookie, removeCookie] = useCookies();
	const location = useLocation();
	const navigate = useNavigate();
	const [showModal, setShowModal] = useState(false);
	const [showAccountModal, setShowAccountModal] = useState(false);
	const [showDropdown, setShowDropdown] = useState(false);
	const dropdownRef = useRef(null);

	const [user, setUser] = useState({
		first_name: "",
		last_name: "",
		auth_level: "",
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

	const handleLogout = () => {
		removeCookie("PassBloggs", { path: "/" });
		removeCookie("userID", { path: "/" });
		navigate("/login");
	};

	// Prevent rendering on the login and registration pages
	if (location.pathname === "/login" || location.pathname === "/register") {
		return null;
	}

	const userName = `${user.first_name} ${user.last_name}`;

	return (
		<>
			<div className="nav-header">
				<nav className="navbar">
					{/* Align logo on the left */}
					<div className="navbar-logo">
						<Link to="/">
							<img
								alt="CodeBloggs logo"
								className="nav-logo-image"
								src="../../public/assets/images/CodeBloggsLogo.png"
							/>
						</Link>
					</div>

					{/* Align buttons on the right */}
					<div className="navbar-buttons">
						<Button className="post-button" onClick={handleModal}>
							Post
						</Button>
						<div className="dropdown-container" ref={dropdownRef}>
							<Dropdown
								show={showDropdown}
								onClose={() => setShowDropdown(false)}
							>
								<Dropdown.Toggle id="dropdown" onClick={handleDropdown}>
									{"Account"}
								</Dropdown.Toggle>
								<Dropdown.Menu>
									<Dropdown.Item onClick={handleAccountModal}>
										Account Settings
									</Dropdown.Item>
									<Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
								</Dropdown.Menu>
							</Dropdown>
						</div>
					</div>
				</nav>
			</div>

			{/* Sidebar Navigation */}
			<div className="nav-container">
				<div className="nav">
					<ul>
						<li>
							<Link to="/" className={location.pathname === "/" ? "active" : ""}>
								Home
							</Link>
						</li>
						<li>
							<Link
								to="/bloggs"
								className={location.pathname === "/bloggs" ? "active" : ""}
							>
								Bloggs
							</Link>
						</li>
						<li>
							<Link
								to="/network"
								className={location.pathname === "/network" ? "active" : ""}
							>
								Network
							</Link>
						</li>
						{user.auth_level === "admin" && (
							<li>
								<Link
									to="/admin"
									className={location.pathname === "/admin" ? "active" : ""}
								>
									Admin
								</Link>
							</li>
						)}
					</ul>
				</div>
			</div>
			<PostModal show={showModal} handleClose={handleModal} />
			<Modal
				className="nav-toast-container"
				show={showAccountModal}
				onHide={handleAccountModal}
				centered
			>
				<Modal.Title className="nav-toast-title">Account Settings</Modal.Title>
				<Modal.Body className="nav-toast-mssg">
					<p>Go to Account Settings.</p>
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
