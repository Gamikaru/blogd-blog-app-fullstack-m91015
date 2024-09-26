import React, { useCallback, useRef, useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar, Sidebar } from '../common'; // Import Navbar and Sidebar
import Logger from '../../utils/Logger'; // Import Logger from utils barrel
import { useNotificationContext } from '../../contexts'; // Import NotificationContext

const AppLayout = () => {
   const [sidebarOpen, setSidebarOpen] = useState(false);
   const toggleButtonRef = useRef(null); // Ref for the toggle button
   const { setPosition, notification } = useNotificationContext(); // Use setPosition from NotificationContext

   const toggleSidebar = useCallback(() => {
      Logger.info(`Toggling sidebar to ${!sidebarOpen}`);
      setSidebarOpen((prevState) => !prevState); // Properly toggle the sidebar state
   }, [sidebarOpen]);

   // Set position once when component mounts
   useEffect(() => {
      Logger.info('AppLayout mounted and setting toast position based on notification type');
      setPosition(notification.type, true); // Set the toast to top-right for private routes (success)

      return () => {
         Logger.info('AppLayout unmounted');
      };
   }, [setPosition, notification.type]); // Re-run when notification type changes


   return (
      <div className="app-layout">
         <Navbar toggleSidebar={toggleSidebar} toggleButtonRef={toggleButtonRef} />
         <Sidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} toggleButtonRef={toggleButtonRef} />
         <Outlet />
      </div>
   );
};

export default AppLayout;
