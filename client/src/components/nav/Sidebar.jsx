// src/components/nav/Sidebar.jsx
import { Button, Portal } from '@components';
import { useUserUpdate } from '@contexts';
import { logger } from '@utils';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { FaCog, FaSignOutAlt } from 'react-icons/fa';

const Sidebar = React.memo(({ sidebarOpen, toggleSidebar, toggleButtonRef }) => {
    const sidebarRef = useRef(null);
    const setUser = useUserUpdate();
    const [closeButtonAnimated, setCloseButtonAnimated] = useState(false); // State to control button animation

    const handleSidebarToggle = useCallback(
        (isOpen) => {
            setCloseButtonAnimated(true); // Trigger button animation
            toggleSidebar(isOpen);

            // Reset button animation after the sidebar animation finishes
            setTimeout(() => setCloseButtonAnimated(false), 500);
        },
        [toggleSidebar]
    );

    const handleClickOutside = useCallback(
        (event) => {
            if (toggleButtonRef.current && toggleButtonRef.current.contains(event.target)) return;
            if (sidebarRef.current && !sidebarRef.current.contains(event.target) && sidebarOpen) {
                handleSidebarToggle(false); // Use unified toggle logic
            }
        },
        [sidebarOpen, handleSidebarToggle, toggleButtonRef]
    );

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [handleClickOutside]);

    const handleLogout = useCallback(() => {
        logger.info('Logging out user');
        setUser(null);
        handleSidebarToggle(false);
    }, [setUser, handleSidebarToggle]);

    const sidebarContent = (
        <div className={`sidebar ${sidebarOpen ? 'open' : ''}`} ref={sidebarRef}>
            <div className="sidebar-content">
                <div className="account-options">
                    <Button className="button button-edit" variant="edit">
                        <FaCog className="icon" /> Settings
                    </Button>
                    <Button
                        className="button button-delete"
                        variant="delete"
                        onClick={handleLogout}
                    >
                        <FaSignOutAlt className="icon" /> Logout
                    </Button>
                </div>
            </div>
        </div>
    );

    return (
        <Portal>
            {sidebarContent}
            <Button
                ref={toggleButtonRef}
                className={`sidebar-close-button ${closeButtonAnimated ? 'animated' : ''}`}
                onClick={() => handleSidebarToggle(!sidebarOpen)}
            >
                Toggle Sidebar
            </Button>
        </Portal>
    );
});

export default Sidebar;
