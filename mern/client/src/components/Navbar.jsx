import React, { useState } from "react";
import { Button, Dropdown, Modal } from "react-bootstrap";
import { useCookies } from "react-cookie";
import { FaBars } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useUser } from "../UserContext";
import PostModal from "./PostModal";

// Logo component for the navigation bar
const Logo = () => (
	<div className="navbar-logo">
		<Link to="/">
			<img
				alt="CodeBloggs Logo"
				aria-label="CodeBloggs Logo"
				className="nav-logo-image"
				src="/assets/images/invertedLogo.png"
				loading="lazy"
			/>
		</Link>
	</div>
);

// UserDropdown component for user account options
const UserDropdown = ({ handleAccountModal, handleLogout }) => {
	const [showDropdown, setShowDropdown] = useState(false);
	const dropdownRef = React.useRef(null);

	// Toggle dropdown visibility
	const handleDropdown = () => setShowDropdown(!showDropdown);

	// Close dropdown when clicking outside or pressing Escape
	React.useEffect(() => {
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
		<div className="dropdown-container" ref={dropdownRef} onMouseLeave={() => setTimeout(() => setShowDropdown(false), 300)}>
			<Dropdown show={showDropdown} onToggle={handleDropdown}>
				<Dropdown.Toggle id="dropdown" onClick={handleDropdown} aria-expanded={showDropdown} aria-controls="dropdown-menu" className="dropdown-toggle">
					ACCOUNT
				</Dropdown.Toggle>
				<Dropdown.Menu id="dropdown-menu" className={`dropdown-menu ${showDropdown ? "show" : ""}`}>
					<Dropdown.Item onClick={handleAccountModal}>Account Settings</Dropdown.Item>
					<Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
				</Dropdown.Menu>
			</Dropdown>
		</div>
	);
};

// NavbarButtons component to display post button and user dropdown
const NavbarButtons = ({ handleModal, handleAccountModal, handleLogout }) => (
	<div className="navbar-buttons">
		<Button aria-label="Create Post" className="post-button" onClick={handleModal}>
			POST
		</Button>
		<UserDropdown handleAccountModal={handleAccountModal} handleLogout={handleLogout} />
	</div>
);

// Navbar component
const Navbar = ({ toggleSidebar, hamburgerRef }) => {
	const [, removeCookie] = useCookies();
	const location = useLocation();
	const navigate = useNavigate();
	const [showModal, setShowModal] = useState(false); // Modal for post creation
	const [showAccountModal, setShowAccountModal] = useState(false); // Modal for account settings
	const user = useUser();

	// Toggle post modal
	const handleModal = () => setShowModal(!showModal);

	// Toggle account modal
	const handleAccountModal = () => setShowAccountModal(!showAccountModal);

	// Handle logout
	const handleLogout = () => {
		removeCookie("PassBloggs", { path: "/" });
		removeCookie("userID", { path: "/" });
		navigate("/login");
	};

	// Prevent Navbar rendering on login and register pages
	if (location.pathname === "/login" || location.pathname === "/register") {
		return null;
	}

	return (
		<>
			<div className="nav-header">
				<nav className="navbar">
					{/* Sidebar toggle button */}
					<button className="sidebar-toggle" onClick={toggleSidebar} ref={hamburgerRef}>
						<FaBars />
					</button>

					{/* Logo */}
					<Logo />

					{/* Navbar buttons */}
					<NavbarButtons handleModal={handleModal} handleAccountModal={handleAccountModal} handleLogout={handleLogout} />
				</nav>
			</div>

			{/* Post Modal */}
			<PostModal show={showModal} handleClose={handleModal} />

			{/* Account Settings Modal */}
			<Modal className="nav-toast-container" show={showAccountModal} onHide={handleAccountModal} centered>
				<Modal.Title className="nav-toast-title">Account Settings</Modal.Title>
				<Modal.Body className="nav-toast-mssg">
					<p>Go to Account Settings.</p>
				</Modal.Body>
				<Modal.Footer>
					<Button className="nav-toast-button" onClick={handleAccountModal}>
						CONFIRM
					</Button>
				</Modal.Footer>
			</Modal>
		</>
	);
};

export default Navbar;