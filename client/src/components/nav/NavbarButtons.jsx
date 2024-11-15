// client/src/components/nav/NavbarButtons.jsx
import { Button } from '@components';
import PropTypes from 'prop-types';
import React, { useCallback } from 'react';
import { FaFeather, FaSearch, FaUser } from 'react-icons/fa';
import { NavLink } from 'react-router-dom';

const NavbarButtons = ({ togglePrivateModal, setShowUserDropdown }) => {
    const handleCreatePost = useCallback(() => {
        togglePrivateModal('post');
    }, [togglePrivateModal]);

    const toggleUserDropdownHandler = useCallback(() => {
        setShowUserDropdown((prev) => !prev);
    }, [setShowUserDropdown]);

    return (
        <>
            <div className="navbar-links">
                <NavLink to="/" className="nav-link" end>
                    Home
                </NavLink>
                <NavLink to="/network" className="nav-link">
                    Network
                </NavLink>
            </div>
            <Button
                className="search-icon"
                aria-label="Search"
                variant="iconButton"
                icon={FaSearch}
            />
            <Button
                className="create-post-icon"
                onClick={handleCreatePost}
                aria-label="Create Post"
                variant="iconButton"
                icon={FaFeather}
            />
            <Button
                className="user-icon"
                onClick={toggleUserDropdownHandler}
                aria-label="User menu"
                variant="iconButton"
                icon={FaUser}
            />
        </>
    );
};

NavbarButtons.propTypes = {
    togglePrivateModal: PropTypes.func.isRequired,
    setShowUserDropdown: PropTypes.func.isRequired,
};

export default React.memo(NavbarButtons);