import { Portal } from '@components';
import PropTypes from 'prop-types';
import React, { useRef } from 'react';
import { NavLink } from 'react-router-dom';
import SimpleBar from 'simplebar-react';
import 'simplebar-react/dist/simplebar.min.css';
import useClickOutside from '../../hooks/useClickOutside';

const Sidebar = React.memo(({ sidebarOpen, handleSidebarClose }) => {
    const sidebarRef = useRef(null);



    // Use the custom hook to handle click outside
    useClickOutside(sidebarRef, () => {
        if (sidebarOpen) handleSidebarClose();
    });

    const sidebarContent = (
        <div className={`custom-sidebar ${sidebarOpen ? 'custom-sidebar--open' : ''}`} ref={sidebarRef}>
            <SimpleBar style={{ maxHeight: '100%' }} className="custom-sidebar__content">
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
            </SimpleBar>
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