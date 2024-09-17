import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import { Outlet } from 'react-router-dom';
import { FaHome, FaBlog, FaNetworkWired, FaUserShield } from 'react-icons/fa';
import { useUser } from './UserContext';

const AppLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false); // Sidebar state
    const sidebarRef = useRef(null); // Reference to sidebar container
    const navRef = useRef(null); // Reference to .nav div
    const hamburgerRef = useRef(null); // Reference to hamburger menu button
    const location = useLocation();
    const user = useUser();

    // Function to toggle sidebar visibility
    const toggleSidebar = () => {
        setSidebarOpen((prevState) => !prevState);
    };

    // Handle clicks outside the .nav.open to close the sidebar
    const handleClickOutside = (event) => {
        if (
            navRef.current &&
            !navRef.current.contains(event.target) &&
            sidebarOpen &&
            hamburgerRef.current &&
            !hamburgerRef.current.contains(event.target)
        ) {
            setSidebarOpen(false);
        }
    };

    // Add event listener for clicks outside the .nav.open
    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [sidebarOpen]);

    // Define sidebar navigation links
    const navLinks = [
        { path: '/', label: 'Home', icon: <FaHome className="nav-icon" /> },
        { path: '/bloggs', label: 'Bloggs', icon: <FaBlog className="nav-icon" /> },
        { path: '/network', label: 'Network', icon: <FaNetworkWired className="nav-icon" /> },
        user.auth_level === 'admin' && {
            path: '/admin',
            label: 'Admin',
            icon: <FaUserShield className="nav-icon" />,
        },
    ];

    return (
        <div className="app-layout">
            <Navbar toggleSidebar={toggleSidebar} hamburgerRef={hamburgerRef} />

            {/* Sidebar container */}
            <div
                className={`nav-container ${sidebarOpen ? 'open' : ''}`}
                ref={sidebarRef}
            >
                {/* Sidebar content */}
                <div className={`nav ${sidebarOpen ? 'open' : ''}`} ref={navRef}>
                    <ul className="navbar-nav">
                        {navLinks.map(
                            (link, index) =>
                                link && (
                                    <li key={index} className="nav-item">
                                        <Link
                                            to={link.path}
                                            className={`nav-link ${location.pathname === link.path ? 'active' : ''
                                                }`}
                                            onClick={() => setSidebarOpen(false)}
                                        >
                                            {link.icon}
                                            <span>{link.label}</span>
                                        </Link>
                                    </li>
                                )
                        )}
                    </ul>
                </div>
            </div>

            {/* Render page-specific content */}
            <Outlet />
        </div>
    );
};

export default AppLayout;