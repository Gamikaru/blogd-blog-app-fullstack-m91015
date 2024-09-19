import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import { Outlet } from 'react-router-dom';
import { FaHome, FaBlog, FaNetworkWired, FaUserShield } from 'react-icons/fa';
import { useUser } from './UserContext';
import ApiClient from './ApiClient'; // Import ApiClient to fetch and update posts

// Helper function for consistent logging
const logInfo = (message, data = null) => {
    if (data) {
        console.log(`[AppLayout] ${message}`, data);
    } else {
        console.log(`[AppLayout] ${message}`);
    }
};

const AppLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false); // Sidebar state
    const sidebarRef = useRef(null); // Reference to sidebar container
    const navRef = useRef(null); // Reference to .nav div
    const hamburgerRef = useRef(null); // Reference to hamburger menu button
    const location = useLocation();
    const { user, loading } = useUser(); // Destructure loading and user
    const [closeTimeout, setCloseTimeout] = useState(null); // State to track timeout for closing the sidebar
    const [userPosts, setUserPosts] = useState([]); // State to track user posts

    // Function to toggle sidebar visibility using useCallback to prevent function recreation on every render
    const toggleSidebar = useCallback(() => {
        const newSidebarState = !sidebarOpen;
        logInfo('Toggling sidebar', { sidebarOpen: newSidebarState });
        setSidebarOpen(newSidebarState);

        if (newSidebarState) {
            startAutoCloseTimer();
        } else {
            clearAutoCloseTimer();
        }
    }, [sidebarOpen]); // Depend on sidebarOpen to retain state

    // Function to handle a new post submission and update the post list
    const handleNewPost = (newPost) => {
        setUserPosts((prevPosts) => [newPost, ...prevPosts]); // Add the new post to the top of the list
    };

    // Fetch posts once user data is loaded
    useEffect(() => {
        if (user && user._id) {
            fetchPosts();
        }
    }, [user]);

    const fetchPosts = async () => {
        try {
            const response = await ApiClient.get(`/post/user/${user._id}`);
            const sortedPosts = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setUserPosts(sortedPosts); // Update state with sorted posts
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
    };

    // Track when props are being lost
    useEffect(() => {
        logInfo('AppLayout render - passing toggleSidebar to Navbar');
        logInfo('toggleSidebar passed:', toggleSidebar);
        logInfo('hamburgerRef passed:', hamburgerRef);
    }, [toggleSidebar, hamburgerRef]);

    // Start the timer to automatically close the sidebar after 5 seconds
    const startAutoCloseTimer = () => {
        logInfo('Starting auto-close timer for sidebar');
        clearAutoCloseTimer(); // Ensure no existing timers

        const timeout = setTimeout(() => {
            logInfo('Auto-closing sidebar after 5 seconds');
            setSidebarOpen(false);
        }, 5000);

        setCloseTimeout(timeout);
    };

    // Clear any existing auto-close timer
    const clearAutoCloseTimer = () => {
        if (closeTimeout) {
            logInfo('Clearing existing auto-close timer');
            clearTimeout(closeTimeout);
            setCloseTimeout(null);
        }
    };

    // Handle when the user hovers over the sidebar (reset timer)
    const handleSidebarHover = () => {
        logInfo('Hovering over sidebar, resetting auto-close timer');
        clearAutoCloseTimer(); // Reset timer on hover
    };

    // Handle when the user leaves the sidebar (start timer again)
    const handleSidebarLeave = () => {
        logInfo('Mouse left sidebar, starting auto-close timer');
        startAutoCloseTimer();
    };

    // Handle clicks outside the sidebar to close it
    const handleClickOutside = (event) => {
        if (
            navRef.current &&
            !navRef.current.contains(event.target) &&
            sidebarOpen &&
            hamburgerRef.current &&
            !hamburgerRef.current.contains(event.target)
        ) {
            logInfo('Click outside detected, closing sidebar');
            setSidebarOpen(false);
            clearAutoCloseTimer();
        }
    };

    // Add event listener for clicks outside the sidebar
    useEffect(() => {
        logInfo('Adding event listener for mousedown');
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            logInfo('Removing event listener for mousedown');
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [sidebarOpen]); // Re-run when sidebar state changes

    // Ensure the layout waits for user data to be fetched
    if (loading) {
        logInfo('User data loading...');
        return <div>Loading...</div>;
    }

    // Define sidebar navigation links
    const navLinks = [
        { path: '/', label: 'Home', icon: <FaHome className="nav-icon" /> },
        { path: '/bloggs', label: 'Bloggs', icon: <FaBlog className="nav-icon" /> },
        { path: '/network', label: 'Network', icon: <FaNetworkWired className="nav-icon" /> },
        user?.authLevel === 'admin' && {
            path: '/admin',
            label: 'Admin',
            icon: <FaUserShield className="nav-icon" />,
        },
    ].filter(Boolean); // Filter out any falsy values (like undefined)

    logInfo('Rendering AppLayout with user', user);

    return (
        <div className="app-layout">
            {/* Pass handleNewPost to Navbar */}
            <Navbar toggleSidebar={toggleSidebar} hamburgerRef={hamburgerRef} onNewPost={handleNewPost} />

            {/* Sidebar container */}
            <div
                className={`nav-container ${sidebarOpen ? 'open' : ''}`}
                ref={sidebarRef}
                onMouseEnter={handleSidebarHover}
                onMouseLeave={handleSidebarLeave}
            >
                {/* Sidebar content */}
                <div className={`nav ${sidebarOpen ? 'open' : ''}`} ref={navRef}>
                    <ul className="navbar-nav">
                        {navLinks.map((link, index) => (
                            <li key={index} className="nav-item">
                                <Link
                                    to={link.path}
                                    className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
                                    onClick={() => setSidebarOpen(false)}
                                >
                                    {link.icon}
                                    <span>{link.label}</span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Render page-specific content */}
            <Outlet context={[userPosts, handleNewPost]} /> {/* Pass posts and handler via context */}
        </div>
    );
};

export default AppLayout;
