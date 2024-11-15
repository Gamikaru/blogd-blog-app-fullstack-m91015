// client/src/components/nav/Sidebar.jsx
import { Button, Portal } from '@components';
import { useUserUpdate } from '@contexts';
import { logger } from '@utils';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useRef } from 'react';
import { FaCog, FaSignOutAlt } from 'react-icons/fa';

const Sidebar = React.memo(
    ({ sidebarOpen, handleSidebarClose, hamburgerRef }) => {
        const sidebarRef = useRef(null);
        const setUser = useUserUpdate();

        const handleClickOutside = useCallback(
            (event) => {
                const clickedInsideSidebar = sidebarRef.current?.contains(event.target);
                const clickedOnHamburger = hamburgerRef.current?.contains(event.target);

                if (!clickedInsideSidebar && !clickedOnHamburger) {
                    handleSidebarClose();
                }
            },
            [handleSidebarClose, hamburgerRef]
        );

        useEffect(() => {
            if (sidebarOpen) {
                document.addEventListener('mousedown', handleClickOutside);
            } else {
                document.removeEventListener('mousedown', handleClickOutside);
            }
            return () => {
                document.removeEventListener('mousedown', handleClickOutside);
            };
        }, [sidebarOpen, handleClickOutside]);

        const handleLogout = useCallback(() => {
            logger.info('Logging out user');
            setUser(null);
            handleSidebarClose();
        }, [setUser, handleSidebarClose]);

        const sidebarContent = (
            <div className={`sidebar ${sidebarOpen ? 'open' : ''}`} ref={sidebarRef}>
                <div className="sidebar-content">
                    <div className="account-options">
                        <Button
                            className="button button-edit"
                            variant="edit"
                        >
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

        return <Portal>{sidebarContent}</Portal>;
    }
);

Sidebar.displayName = 'Sidebar';

Sidebar.propTypes = {
    sidebarOpen: PropTypes.bool.isRequired,
    handleSidebarClose: PropTypes.func.isRequired,
    hamburgerRef: PropTypes.shape({
        current: PropTypes.instanceOf(window.HTMLElement),
    }).isRequired,
};

export default Sidebar;