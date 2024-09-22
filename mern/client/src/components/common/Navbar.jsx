import React, { useEffect } from "react";
import { FaBars } from "react-icons/fa";
import { useCookies } from "react-cookie";
import { useLocation, useNavigate } from "react-router-dom";
import { useUser, useModalContext, useNotificationContext } from "../../contexts"; // Import contexts
import Logger from "../../utils/Logger"; // Import Logger
import Logo from "../common/Logo"; // Import the separate Logo component
import NavbarButtons from "../common/NavbarButtons"; // Import the separate NavbarButtons component
import PostModal from "../modals/PostModal"; // Import PostModal for creating posts

const Navbar = ({ toggleSidebar }) => {
   const [, removeCookie] = useCookies();
   const location = useLocation();
   const navigate = useNavigate();
   const { showNotification } = useNotificationContext();
   const { user } = useUser();

   useEffect(() => {
      Logger.info("Navbar initialized with props");
   }, []);

   // Handle user logout
   const handleLogout = () => {
      Logger.info("Logging out user");
      removeCookie("PassBloggs", { path: "/" });
      removeCookie("userID", { path: "/" });
      navigate("/login");
      showNotification("Logged out successfully!", "success");
   };

   // Hide the navbar on login or register pages
   if (location.pathname === "/login" || location.pathname === "/register") {
      return null;
   }

   return (
      <>
         <div className="nav-header">
            <nav className="navbar">
               {/* Sidebar toggle (hamburger icon) */}
               <button
                  className="sidebar-toggle"
                  onClick={() => {
                     Logger.info("Hamburger clicked, toggling sidebar");
                     toggleSidebar(); // Toggle sidebar visibility
                  }}
               >
                  <FaBars />
               </button>

               {/* Logo */}
               <Logo />

               {/* Navbar buttons: Post and UserDropdown */}
               <NavbarButtons
                  handleAccountModal={() => Logger.info("Toggling account modal")}
                  handleLogout={handleLogout}
               />
            </nav>
         </div>

         {/* PostModal component for creating posts */}
         <PostModal />
      </>
   );
};

export default Navbar;