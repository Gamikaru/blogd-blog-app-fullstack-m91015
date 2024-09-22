import React, { useState, useRef, useEffect } from "react";
import { Dropdown } from "react-bootstrap";
import Logger from "../../utils/Logger";

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

      // Attach listeners for closing the dropdown
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscKey);

      // Clean up event listeners
      return () => {
         Logger.info("Removing account dropdown event listeners");
         document.removeEventListener("mousedown", handleClickOutside);
         document.removeEventListener("keydown", handleEscKey);
      };
   }, []);

   return (
      <div className="dropdown-container" ref={dropdownRef}>
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
               onMouseEnter={() => setShowDropdown(true)} // Prevent closing on hover
               onMouseLeave={() => setShowDropdown(false)} // Close smoothly on mouse leave
            >
               <Dropdown.Item key="settings" onClick={handleAccountModal}>
                  Account Settings
               </Dropdown.Item>
               <Dropdown.Item key="logout" onClick={handleLogout}>
                  Logout
               </Dropdown.Item>
            </Dropdown.Menu>
         </Dropdown>
      </div>
   );
};

export default UserDropdown;
