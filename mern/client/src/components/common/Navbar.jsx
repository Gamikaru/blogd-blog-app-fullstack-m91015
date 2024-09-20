import React, { useState, useRef, useEffect } from "react";
import { Button, Dropdown } from "react-bootstrap";
import { useCookies } from "react-cookie";
import { FaBars } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useUser, useModalContext, useNotificationContext } from "../../contexts"; // Import UserContext, ModalContext, and NotificationContext from contexts barrel
import { PostModal } from "../modals"; // Import PostModal from modals barrel
import Logger from "../../utils/Logger"; // Import Logger from utils barrel


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
      Logger.info("Toggling account dropdown", { showDropdown: !showDropdown });
      setShowDropdown(!showDropdown);
   };

   useEffect(() => {
      const handleClickOutside = (event) => {
         if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            Logger.info("Click outside account dropdown, closing it");
            setShowDropdown(false);
         }
      };

      const handleEscKey = (event) => {
         if (event.key === "Escape") {
            Logger.info("Escape key pressed, closing account dropdown");
            setShowDropdown(false);
         }
      };

      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscKey);

      return () => {
         Logger.info("Removing account dropdown event listeners");
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
               <Dropdown.Item key="settings" onClick={handleAccountModal}>Account Settings</Dropdown.Item>
               <Dropdown.Item key="logout" onClick={handleLogout}>Logout</Dropdown.Item>
            </Dropdown.Menu>
         </Dropdown>
      </div>
   );
};

// NavbarButtons component to display the post button and user dropdown
const NavbarButtons = ({ handleAccountModal, handleLogout }) => {
   const { toggleModal } = useModalContext(); // Hook to control PostModal visibility

   return (
      <div className="navbar-buttons">
         {/* Post Button to trigger PostModal */}
         <Button aria-label="Create Post" className="post-button" onClick={toggleModal}>
            POST
         </Button>
         <UserDropdown handleAccountModal={handleAccountModal} handleLogout={handleLogout} />
      </div>
   );
};

// Navbar component
const Navbar = ({ toggleSidebar }) => {
   const [, removeCookie] = useCookies();
   const location = useLocation();
   const navigate = useNavigate();
   const { showNotification } = useNotificationContext();
   const { user } = useUser();

   useEffect(() => {
      Logger.info('Navbar initialized with props');
   }, []);

   const handleLogout = () => {
      Logger.info("Logging out user");
      removeCookie("PassBloggs", { path: "/" });
      removeCookie("userID", { path: "/" });
      navigate("/login");
      showNotification("Logged out successfully!", "success");
   };

   if (location.pathname === "/login" || location.pathname === "/register") {
      return null; // Hide the navbar in login or register pages
   }

   return (
      <>
         <div className="nav-header">
            <nav className="navbar">
               <button
                  className="sidebar-toggle"
                  onClick={() => {
                     Logger.info("Hamburger clicked, toggling sidebar");
                     toggleSidebar(); // Trigger sidebar toggle
                  }}
               >
                  <FaBars />
               </button>
               <Logo />
               {/* Render Post button and UserDropdown */}
               <NavbarButtons
                  handleAccountModal={() => Logger.info("Toggling account modal")}
                  handleLogout={handleLogout}
               />
            </nav>
         </div>

         {/* PostModal is still part of the Navbar and will be triggered by the POST button */}
         <PostModal />
      </>
   );
};

export default Navbar;
