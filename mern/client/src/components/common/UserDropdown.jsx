import React, { useEffect, useRef, useState } from "react";
import { Dropdown } from "react-bootstrap";
import Logger from "../../utils/Logger";

const UserDropdown = ({ handleAccountModal, handleLogout }) => {
   const [showDropdown, setShowDropdown] = useState(false);
   const [delayedShow, setDelayedShow] = useState(false);
   const [isOpening, setIsOpening] = useState(false); // Track if the dropdown is in the process of opening
   const [autoCloseTimeout, setAutoCloseTimeout] = useState(null); // Track auto-close timer
   const dropdownRef = useRef(null);

   // Function to toggle the dropdown
   const handleDropdown = () => {
      Logger.info(`Toggling account dropdown. showDropdown before toggle: ${showDropdown}`);
      setShowDropdown(!showDropdown);
      if (!showDropdown) {
         Logger.info("Dropdown is opening, setting isOpening to true");
         setIsOpening(true); // Mark as opening when toggle is clicked to show
      } else {
         Logger.info("Dropdown is closing, setting isOpening to false immediately");
         setIsOpening(false); // Immediately set to false if closing
         clearAutoCloseTimer(); // Clear auto-close timer if closing manually
      }
   };

   // Function to start auto-close timer
   const startAutoCloseTimer = () => {
      Logger.info("Starting 3-second auto-close timer");
      const timeout = setTimeout(() => {
         Logger.info("Auto-close timer completed, closing dropdown");
         setShowDropdown(false); // Close the dropdown after 3 seconds
         setDelayedShow(false); // Hide dropdown
         setIsOpening(false); // Reset opening state
      }, 3000); // 3 seconds

      setAutoCloseTimeout(timeout);
   };

   // Function to clear the auto-close timer
   const clearAutoCloseTimer = () => {
      if (autoCloseTimeout) {
         Logger.info("Clearing auto-close timer");
         clearTimeout(autoCloseTimeout);
         setAutoCloseTimeout(null);
      }
   };

   useEffect(() => {
      if (showDropdown) {
         Logger.info("Dropdown is set to show, starting delay timer (300ms)");
         const timeout = setTimeout(() => {
            Logger.info("Delay timer ended, setting delayedShow to true and isOpening to false");
            setDelayedShow(true); // Show after delay
            setIsOpening(false); // After the delay, it's fully opened
            startAutoCloseTimer(); // Start auto-close timer once fully opened
         }, 300); // Match with your CSS transition duration (0.3s)

         return () => {
            Logger.info("Component unmounted or dropdown state changed, cleaning up delay timer");
            clearTimeout(timeout);
         };
      } else {
         Logger.info("Dropdown is set to hide, resetting delayedShow and isOpening immediately");
         setDelayedShow(false); // Hide dropdown immediately
         setIsOpening(false); // Reset opening state
         clearAutoCloseTimer(); // Clear the timer if the dropdown is hidden
      }
   }, [showDropdown]);

   useEffect(() => {
      const handleClickOutside = (event) => {
         if (dropdownRef.current && !dropdownRef.current.contains(event.target) && delayedShow) {
            Logger.info("Click outside detected, closing dropdown");
            setShowDropdown(false);
         }
      };

      const handleEscKey = (event) => {
         if (event.key === "Escape" && delayedShow) {
            Logger.info("Escape key pressed, closing dropdown");
            setShowDropdown(false);
         }
      };

      Logger.info("Attaching document event listeners for click outside and Escape key");
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscKey);

      return () => {
         Logger.info("Cleaning up document event listeners");
         document.removeEventListener("mousedown", handleClickOutside);
         document.removeEventListener("keydown", handleEscKey);
      };
   }, [delayedShow]);

   return (
      <div className="dropdown-container" ref={dropdownRef}>
         <Dropdown show={showDropdown} onToggle={handleDropdown}>
            <Dropdown.Toggle
               id="dropdown"
               onClick={handleDropdown}
               aria-expanded={showDropdown}
               aria-controls="dropdown-menu"
               className="dropdown-toggle"
               onMouseEnter={() => {
                  Logger.info("Mouse entered dropdown toggle, clearing auto-close timer");
                  clearAutoCloseTimer(); // Clear timer if mouse enters
               }}
               onMouseLeave={() => {
                  if (!isOpening && delayedShow) {
                     Logger.info("Mouse left dropdown toggle, restarting auto-close timer");
                     startAutoCloseTimer(); // Restart timer on mouse leave if not opening
                  }
               }}
            >
               ACCOUNT
            </Dropdown.Toggle>

            <Dropdown.Menu
               id="dropdown-menu"
               className={`dropdown-menu ${delayedShow ? "show" : ""}`}
               onMouseEnter={() => {
                  Logger.info("Mouse entered dropdown, clearing auto-close timer");
                  clearAutoCloseTimer(); // Clear the timer when mouse hovers over the dropdown
               }}
               onMouseLeave={() => {
                  if (!isOpening) { // Don't close while the dropdown is opening
                     Logger.info("Mouse left dropdown menu, restarting auto-close timer");
                     startAutoCloseTimer(); // Restart the timer when mouse leaves the dropdown
                  } else {
                     Logger.info("Mouse left dropdown but it's still opening, ignoring close");
                  }
               }}
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
