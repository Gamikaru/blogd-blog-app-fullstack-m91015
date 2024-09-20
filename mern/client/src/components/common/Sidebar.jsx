// src/components/Sidebar.jsx
import React, { useEffect, useRef, useState } from 'react';
import { FaBlog, FaHome, FaNetworkWired, FaUserShield } from 'react-icons/fa';
import { Link, useLocation } from 'react-router-dom';
import Logger from '../../utils/Logger'; // Import Logger

const Sidebar = ({ sidebarOpen, toggleSidebar }) => {
   const sidebarRef = useRef(null);
   const navRef = useRef(null);
   const [closeTimeout, setCloseTimeout] = useState(null);
   const location = useLocation();

   const startAutoCloseTimer = () => {
      Logger.info('Starting auto-close timer');
      clearAutoCloseTimer();

      const timeout = setTimeout(() => {
         Logger.info('Auto-closing sidebar after 5 seconds');
         toggleSidebar(false); // Close the sidebar after 5 seconds
      }, 5000);

      setCloseTimeout(timeout);
   };

   const clearAutoCloseTimer = () => {
      if (closeTimeout) {
         Logger.info('Clearing existing auto-close timer');
         clearTimeout(closeTimeout);
         setCloseTimeout(null);
      }
   };

   const handleSidebarHover = () => {
      Logger.info('Hovering over sidebar, clearing close timer');
      clearAutoCloseTimer();
   };

   const handleSidebarMouseLeave = () => {
      Logger.info('Mouse left sidebar, restarting close timer');
      startAutoCloseTimer();
   };

   useEffect(() => {
      Logger.info('Adding event listener for mousedown to handle clicks outside');
      const handleClickOutside = (event) => {
         if (
            navRef.current &&
            !navRef.current.contains(event.target) &&
            sidebarOpen &&
            sidebarRef.current &&
            !sidebarRef.current.contains(event.target)
         ) {
            Logger.info('Click outside detected, closing sidebar');
            toggleSidebar(false); // Close sidebar when clicking outside
            clearAutoCloseTimer();
         }
      };
      document.addEventListener('mousedown', handleClickOutside);

      return () => {
         Logger.info('Removing event listener for mousedown');
         document.removeEventListener('mousedown', handleClickOutside);
      };
   }, [sidebarOpen, toggleSidebar]);

   const navLinks = [
      { path: '/', label: 'Home', icon: <FaHome className="nav-icon" /> },
      { path: '/bloggs', label: 'Bloggs', icon: <FaBlog className="nav-icon" /> },
      { path: '/network', label: 'Network', icon: <FaNetworkWired className="nav-icon" /> },
      { path: '/admin', label: 'Admin', icon: <FaUserShield className="nav-icon" />, condition: true },
   ].filter(Boolean);

   return (
      <div
         className={`nav-container ${sidebarOpen ? 'open' : ''}`}
         ref={sidebarRef}
         onMouseEnter={handleSidebarHover}
         onMouseLeave={handleSidebarMouseLeave}
      >
         <div className={`nav ${sidebarOpen ? 'open' : ''}`} ref={navRef}>
            <ul className="navbar-nav">
               {navLinks.map((link, index) => (
                  <li key={index} className="nav-item">
                     <Link
                        to={link.path}
                        className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
                        onClick={() => toggleSidebar(false)} // Close sidebar on navigation click
                     >
                        {link.icon}
                        <span>{link.label}</span>
                     </Link>
                  </li>
               ))}
            </ul>
         </div>
      </div>
   );
};

export default Sidebar;
