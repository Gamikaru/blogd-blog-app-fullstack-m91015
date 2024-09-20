// src/components/AppLayout.jsx
import React, { useCallback, useState } from 'react';
import { Outlet } from 'react-router-dom';
import {Navbar, Sidebar} from '../common'; // Import Navbar and Sidebar
import Logger from '../../utils/Logger'; // Import Logger from utils barrel


const AppLayout = () => {
   const [sidebarOpen, setSidebarOpen] = useState(false);

   const toggleSidebar = useCallback(() => {
      Logger.info(`Toggling sidebar to ${!sidebarOpen}`);
      setSidebarOpen(!sidebarOpen); // Toggle the sidebar state
   }, [sidebarOpen]);

   return (
      <div className="app-layout">
         <Navbar toggleSidebar={toggleSidebar} />
         <Sidebar sidebarOpen={sidebarOpen} toggleSidebar={setSidebarOpen} />
         <Outlet />
      </div>
   );
};

export default AppLayout;
