// client/src/components/nav/Sidebar.jsx
import { Button, Portal } from '@components';
import { useUserUpdate } from '@contexts';
import { logger } from '@utils';
import PropTypes from 'prop-types';
import React, { useCallback, useRef } from 'react';
import { FaSignOutAlt } from 'react-icons/fa';
import useClickOutside from '../../hooks/useClickOutside';

const Sidebar = React.memo(({ sidebarOpen, handleSidebarClose}) => {
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
        <div className={`sidebar ${sidebarOpen ? 'open' : ''}`} ref={sidebarRef}>
            <div className="sidebar-content">
                <div className="account-options">
                    <Button variant="settings" className="button button-edit">
                        Settings
                    </Button>

                    <Button className="button button-delete" variant="delete" onClick={handleLogout}>
                        <FaSignOutAlt className="icon" /> Logout
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
    hamburgerRef: PropTypes.shape({
        current: PropTypes.instanceOf(HTMLElement),
    }).isRequired,
};

export default Sidebar;