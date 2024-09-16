import React, { useEffect, useRef, useState } from "react";
import { Button, Dropdown, Modal } from "react-bootstrap";
import { useCookies } from "react-cookie";
import { Link, useLocation, useNavigate } from "react-router-dom";
import PostModal from "./PostModal";

const Logo = () => (
	<div className="navbar-logo">
		<Link to="/">
			<img
				alt="CodeBloggs Logo"
				aria-label="CodeBloggs Logo"
				className="nav-logo-image"
				src="/assets/images/CodeBloggsLogo.png"
				loading="lazy"
			/>
		</Link>
	</div>
);

const UserDropdown = ({ handleAccountModal, handleLogout }) => {
	const [showDropdown, setShowDropdown] = useState(false);
	const dropdownRef = useRef(null);

	const handleDropdown = () => setShowDropdown(!showDropdown);

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
				setShowDropdown(false);
			}
		};

		const handleEscKey = (event) => {
			if (event.key === "Escape") {
				setShowDropdown(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		document.addEventListener("keydown", handleEscKey);

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
			document.removeEventListener("keydown", handleEscKey);
		};
	}, []);

	return (
		<div
			className="dropdown-container"
			ref={dropdownRef}
			onMouseLeave={() => setTimeout(() => setShowDropdown(false), 300)}
		>
			<Dropdown show={showDropdown} onToggle={handleDropdown}>
				<Dropdown.Toggle
					id="dropdown"
					onClick={handleDropdown}
					aria-expanded={showDropdown}
					aria-controls="dropdown-menu"
				>
					{"ACCOUNT"}
				</Dropdown.Toggle>
				<Dropdown.Menu
					id="dropdown-menu"
					className={`dropdown-menu ${showDropdown ? "show" : ""}`}
				>
					<Dropdown.Item onClick={handleAccountModal}>
						Account Settings
					</Dropdown.Item>
					<Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
				</Dropdown.Menu>
			</Dropdown>
		</div>
	);
};

const NavbarButtons = ({ handleModal, handleDropdown, showDropdown, handleAccountModal, handleLogout, postButtonText }) => (
	<div className="navbar-buttons">
		<Button aria-label="Create Post" className="post-button" onClick={handleModal}>
			{postButtonText || 'POST'}
		</Button>
		<UserDropdown
			handleDropdown={handleDropdown}
			showDropdown={showDropdown}
			handleAccountModal={handleAccountModal}
			handleLogout={handleLogout}
		/>
	</div>
);

export default function Navbar() {
	const [cookie, removeCookie] = useCookies();
	const location = useLocation();
	const navigate = useNavigate();
	const [showModal, setShowModal] = useState(false);
	const [showAccountModal, setShowAccountModal] = useState(false);
	const [showDropdown, setShowDropdown] = useState(false);

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

	const handleModal = () => setShowModal(!showModal);
	const handleAccountModal = () => setShowAccountModal(!showAccountModal);
	const handleDropdown = () => setShowDropdown(!showDropdown);

	const handleLogout = () => {
		removeCookie("PassBloggs", { path: "/" });
		removeCookie("userID", { path: "/" });
		navigate("/login");
	};

	// Prevent rendering on login and registration pages
	if (location.pathname === "/login" || location.pathname === "/register") {
		return null;
	}

	const navLinks = [
		{ path: "/", label: "Home" },
		{ path: "/bloggs", label: "Bloggs" },
		{ path: "/network", label: "Network" },
		{ path: "/admin", label: "Admin", condition: user.auth_level === "admin" }
	];

	return (
		<>
			<div className="nav-header">
				<nav className="navbar">
					<Logo />
					<NavbarButtons
						handleModal={handleModal}
						handleDropdown={handleDropdown}
						showDropdown={showDropdown}
						handleAccountModal={handleAccountModal}
						handleLogout={handleLogout}
					/>
				</nav>
			</div>

			{/* Sidebar Navigation */}
			<div className="nav-container">
				<div className="nav">
					<ul>
						{navLinks.map((link, index) => (
							link.condition !== false && (
								<li key={index}>
									<Link to={link.path} className={location.pathname === link.path ? "active" : ""}>
										{link.label}
									</Link>
								</li>
							)
						))}
					</ul>
				</div>
			</div>
			<PostModal show={showModal} handleClose={handleModal} />
			<Modal className="nav-toast-container" show={showAccountModal} onHide={handleAccountModal} centered>
				<Modal.Title className="nav-toast-title">Account Settings</Modal.Title>
				<Modal.Body className="nav-toast-mssg">
					<p>Go to Account Settings.</p>
				</Modal.Body>
				<Modal.Footer>
					<Button className="nav-toast-button" onClick={handleAccountModal}>CONFIRM</Button>
				</Modal.Footer>
			</Modal>
		</>
	);
}
