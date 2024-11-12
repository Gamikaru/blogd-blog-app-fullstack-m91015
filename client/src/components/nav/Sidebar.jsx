// src/components/nav/Sidebar.jsx
import { Button } from '@components';
import {Portal} from '@components';
import { useUserUpdate } from '@contexts';
import { logger } from '@utils';
import { useEffect, useRef } from "react";
import { FaCog, FaSignOutAlt } from "react-icons/fa";
const Sidebar = ({ sidebarOpen, toggleSidebar, toggleButtonRef }) => {
    const sidebarRef = useRef(null);
    const setUser = useUserUpdate();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (toggleButtonRef.current && toggleButtonRef.current.contains(event.target)) return;
            if (sidebarRef.current && !sidebarRef.current.contains(event.target) && sidebarOpen) {
                toggleSidebar(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [sidebarOpen, toggleSidebar, toggleButtonRef]);

    const handleLogout = () => {
        logger.info("Logging out user");
        setUser(null);
        toggleSidebar(false);
    };

    const sidebarContent = (
        <div className={`sidebar ${sidebarOpen ? "open" : ""}`} ref={sidebarRef}>
            <div className="sidebar-content">
                <div className="account-options">
                    <Button className="button button-edit" variant="edit">
                        <FaCog className="icon" /> Settings
                    </Button>
                    <Button className="button button-delete" variant="delete" onClick={handleLogout}>
                        <FaSignOutAlt className="icon" /> Logout
                    </Button>
                </div>
            </div>
        </div>
    );

    return <Portal>{sidebarContent}</Portal>;
};

export default Sidebar;