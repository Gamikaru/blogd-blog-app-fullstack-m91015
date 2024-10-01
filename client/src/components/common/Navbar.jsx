import React, { useEffect } from "react";
import { useCookies } from "react-cookie";
import { FaBars } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import { useNotificationContext, useUser, useUserUpdate } from "../../contexts"; // Import contexts
import Logger from "../../utils/Logger"; // Import Logger
import Logo from "../common/Logo"; // Import the separate Logo component
import NavbarButtons from "../common/NavbarButtons"; // Import the separate NavbarButtons component
import PostModal from "../modals/PostModal"; // Import PostModal for creating posts

const Navbar = ({ toggleSidebar, toggleButtonRef }) => {
   const [, removeCookie] = useCookies();
   const location = useLocation();
   const navigate = useNavigate();
   const { showNotification } = useNotificationContext();
   const { user } = useUser();
   const setUser = useUserUpdate(); // Hook to update user state

   useEffect(() => {
      Logger.info("Navbar initialized with props");
   }, []);

   // Handle user logout
   const handleLogout = () => {
      Logger.info("Logging out user");

      // Remove cookies
      removeCookie("PassBloggs", { path: "/" });
      removeCookie("userID", { path: "/" });

      // Clear user state in UserContext
      setUser(null);

      // Use a small delay to allow the notification to show before navigation
      setTimeout(() => {
         // Navigate to login page smoothly
         navigate("/login", { replace: true });
      }, 1000); // 1-second delay for a smooth transition
   };


   // Hide the navbar on login or register pages
   if (location.pathname === "/login" || location.pathname === "/register") {
      return null;
   }

   return (
      <>
         <div className="nav-header">
            <nav className="navbar">
               {/* Navbar buttons: Post and UserDropdown */}
               <NavbarButtons
                  handleAccountModal={() => Logger.info("Toggling account modal")}
                  handleLogout={handleLogout} // Pass handleLogout to NavbarButtons
               />

               {/* Logo */}
               <Logo />

               {/* Sidebar toggle (hamburger icon) */}
               <button
                  ref={toggleButtonRef} // Pass the reference to the button
                  className="sidebar-toggle"
                  onClick={() => {
                     Logger.info("Hamburger clicked, toggling sidebar");
                     toggleSidebar(); // Toggle sidebar visibility
                  }}
               >
                  <FaBars />
               </button>
            </nav>
         </div>

         {/* PostModal component for creating posts */}
         <PostModal />
      </>
   );
};

export default Navbar;
