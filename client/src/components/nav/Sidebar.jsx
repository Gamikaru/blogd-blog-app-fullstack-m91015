import { Button, Portal } from '@components';
import { useUserUpdate } from '@contexts';
import { logger } from '@utils';
import PropTypes from 'prop-types';
import React, { useCallback, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import useClickOutside from '../../hooks/useClickOutside';

const Sidebar = React.memo(({ sidebarOpen, handleSidebarClose }) => {
    const sidebarRef = useRef(null);
    const setUser = useUserUpdate();

    const handleLogout = useCallback(() => {
        logger.info('Logging out user');
        setUser(null);
        handleSidebarClose();
    }, [setUser, handleSidebarClose]);

    // Use the custom hook to handle click outside
    useClickOutside(sidebarRef, () => {
        if (sidebarOpen) handleSidebarClose();
    });

    const sidebarContent = (
        <div className={`custom-sidebar ${sidebarOpen ? 'custom-sidebar--open' : ''}`} ref={sidebarRef}>
            <div className="custom-sidebar__content">
                <nav className="custom-sidebar__nav">
                    <NavLink to="/explore" className="custom-sidebar__link" onClick={handleSidebarClose}>
                        Explore
                    </NavLink>
                    <NavLink to="/learn" className="custom-sidebar__link" onClick={handleSidebarClose}>
                        Learn
                    </NavLink>
                    <NavLink to="/about" className="custom-sidebar__link" onClick={handleSidebarClose}>
                        About
                    </NavLink>
                    <NavLink to="/contact" className="custom-sidebar__link" onClick={handleSidebarClose}>
                        Contact
                    </NavLink>
                </nav>
                <div className="custom-sidebar__account-options">
                    <Button variant="settings">
                        Settings
                    </Button>

                    <Button variant="delete" onClick={handleLogout}>
                        Logout
                    </Button>
                </div>
            </div>
        </div>
    );

    return <Portal>{sidebarContent}</Portal>;
});

Sidebar.displayName = 'Sidebar';

Sidebar.propTypes = {
    sidebarOpen: PropTypes.bool.isRequired,
    handleSidebarClose: PropTypes.func.isRequired,
};

export default Sidebar;