import React, { useEffect, useRef, useState } from "react";
import Logger from "../../utils/Logger";

const UserDropdown = ({ handleAccountModal, handleLogout }) => {
   const [showDropdown, setShowDropdown] = useState(false);
   const [delayedShow, setDelayedShow] = useState(false);
   const [isOpening, setIsOpening] = useState(false);
   const [autoCloseTimeout, setAutoCloseTimeout] = useState(null);
   const dropdownRef = useRef(null);

   const handleDropdown = () => {
      Logger.info(`Toggling account dropdown. showDropdown before toggle: ${showDropdown}`);
      setShowDropdown(!showDropdown);
      if (!showDropdown) {
         setIsOpening(true);
      } else {
         setIsOpening(false);
         clearAutoCloseTimer();
      }
   };

   const startAutoCloseTimer = () => {
      const timeout = setTimeout(() => {
         setShowDropdown(false);
         setDelayedShow(false);
         setIsOpening(false);
      }, 3000);
      setAutoCloseTimeout(timeout);
   };

   const clearAutoCloseTimer = () => {
      if (autoCloseTimeout) {
         clearTimeout(autoCloseTimeout);
         setAutoCloseTimeout(null);
      }
   };

   useEffect(() => {
      if (showDropdown) {
         const timeout = setTimeout(() => {
            setDelayedShow(true);
            setIsOpening(false);
            startAutoCloseTimer();
         }, 300);

         return () => clearTimeout(timeout);
      } else {
         setDelayedShow(false);
         setIsOpening(false);
         clearAutoCloseTimer();
      }
   }, [showDropdown]);

   useEffect(() => {
      const handleClickOutside = (event) => {
         if (dropdownRef.current && !dropdownRef.current.contains(event.target) && delayedShow) {
            setShowDropdown(false);
         }
      };

      const handleEscKey = (event) => {
         if (event.key === "Escape" && delayedShow) {
            setShowDropdown(false);
         }
      };

      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscKey);

      return () => {
         document.removeEventListener("mousedown", handleClickOutside);
         document.removeEventListener("keydown", handleEscKey);
      };
   }, [delayedShow]);

   return (
      <div className="dropdown-container" ref={dropdownRef}>
         <button
            className="dropdown-toggle"
            onClick={handleDropdown}
            aria-expanded={showDropdown}
            aria-controls="dropdown-menu"
            onMouseEnter={clearAutoCloseTimer}
            onMouseLeave={() => {
               if (!isOpening && delayedShow) startAutoCloseTimer();
            }}
         >
            ACCOUNT
         </button>

         <div
            id="dropdown-menu"
            className={`dropdown-menu ${delayedShow ? "show" : ""}`}
            onMouseEnter={clearAutoCloseTimer}
            onMouseLeave={() => {
               if (!isOpening) startAutoCloseTimer();
            }}
         >
            <div className="dropdown-item" onClick={handleAccountModal}>
               Account Settings
            </div>
            <div className="dropdown-item" onClick={handleLogout}>
               Logout
            </div>
         </div>
      </div>
   );
};

export default UserDropdown;
