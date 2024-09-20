import React, { useState, useRef, useEffect } from "react";
import { Button, Dropdown, Modal, Toast } from "react-bootstrap";
import { useCookies } from "react-cookie";
import { FaBars } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useUser } from "../UserContext";
import PostModal from "./PostModal";
import { usePostContext } from '../AppLayout'; // Import the PostContext from AppLayout

// Helper function for consistent logging
const logInfo = (message, data = null) => {
   if (data) {
      console.log(`[Navbar] ${message}`, data);
   } else {
      console.log(`[Navbar] ${message}`);
   }
};

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
   const dropdownRef = useRef(null);

   const handleDropdown = () => {
      logInfo("Toggling account dropdown", { showDropdown: !showDropdown });
      setShowDropdown(!showDropdown);
   };

   useEffect(() => {
      const handleClickOutside = (event) => {
         if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            logInfo("Click outside account dropdown, closing it");
            setShowDropdown(false);
         }
      };

      const handleEscKey = (event) => {
         if (event.key === "Escape") {
            logInfo("Escape key pressed, closing account dropdown");
            setShowDropdown(false);
         }
      };

      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscKey);

      return () => {
         logInfo("Removing account dropdown event listeners");
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
               className="dropdown-toggle"
            >
               ACCOUNT
            </Dropdown.Toggle>
            <Dropdown.Menu
               id="dropdown-menu"
               className={`dropdown-menu ${showDropdown ? "show" : ""}`}
            >
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
   const [showModal, setShowModal] = useState(false);
   const [showAccountModal, setShowAccountModal] = useState(false);
   const [showSuccessToast, setShowSuccessToast] = useState(false);
   const { user } = useUser();
   const { handleNewPost } = usePostContext(); // Get handleNewPost from PostContext

   // Log the received props to check if `toggleSidebar` and `onNewPost` are correctly passed
   useEffect(() => {
      logInfo('Navbar received props:', { toggleSidebar, hamburgerRef });
   }, [toggleSidebar, hamburgerRef]);

   const handleModal = () => {
      logInfo("Toggling post modal", { showModal: !showModal });
      setShowModal(!showModal);
   };

   const handleAccountModal = () => {
      logInfo("Toggling account modal", { showAccountModal: !showAccountModal });
      setShowAccountModal(!showAccountModal);
   };

   const handlePostSuccess = (newPost) => {
      logInfo("Post submitted successfully", { newPost });
      setShowModal(false);
      setShowSuccessToast(true);
      setTimeout(() => {
         setShowSuccessToast(false);
      }, 3000);
      handleNewPost(newPost); // Add the new post to the global post list
   };

   const handleLogout = () => {
      logInfo("Logging out user");
      removeCookie("PassBloggs", { path: "/" });
      removeCookie("userID", { path: "/" });
      navigate("/login");
   };

   // Hide Navbar on login and register pages
   if (location.pathname === "/login" || location.pathname === "/register") {
      return null;
   }

   return (
      <>
         <div className="nav-header">
            <nav className="navbar">
               <button
                  className="sidebar-toggle"
                  onClick={() => {
                     logInfo("Hamburger clicked, toggling sidebar");
                     toggleSidebar();
                  }}
                  ref={hamburgerRef}
               >
                  <FaBars />
               </button>
               <Logo />
               <NavbarButtons
                  handleModal={handleModal}
                  handleAccountModal={handleAccountModal}
                  handleLogout={handleLogout}
               />
            </nav>
         </div>

         {/* PostModal is only triggered by the POST button */}
         <PostModal
            show={showModal}
            handleClose={handleModal}
            onPostSuccess={handlePostSuccess} // Call handlePostSuccess with the new post
         />

         <Toast
            show={showSuccessToast}
            onClose={() => setShowSuccessToast(false)}
            delay={3000}
            autohide
            style={{ position: "fixed", bottom: "20px", right: "20px" }}
         >
            <Toast.Body>Post submitted successfully!</Toast.Body>
         </Toast>

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
                  CONFIRM
               </Button>
            </Modal.Footer>
         </Modal>
      </>
   );
};

export default Navbar;
