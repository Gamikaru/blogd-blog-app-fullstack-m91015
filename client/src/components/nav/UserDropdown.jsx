// src/components/nav/UserDropdown.jsx

import { Portal } from '@components';
import { usePrivateModalContext, useUser } from '@contexts';
import { motion } from 'framer-motion';
import React, { useCallback, useEffect, useRef } from 'react';
import {
    FaBirthdayCake,
    FaBriefcase,
    FaCog,
    FaEnvelope,
    FaMapMarkerAlt,
    FaUser,
} from 'react-icons/fa';
import { FiLogOut } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const UserDropdown = React.memo(({ showDropdown, setShowDropdown, handleLogout, position }) => {
    const dropdownRef = useRef(null);
    const { user } = useUser();
    const { togglePrivateModal } = usePrivateModalContext();
    const navigate = useNavigate();

    const handleSettingsClick = useCallback(() => {
        togglePrivateModal('userSettings');
        setShowDropdown(false);
    }, [togglePrivateModal, setShowDropdown]);

    const handleProfileClick = useCallback(() => {
        navigate('/profile');
        setShowDropdown(false);
    }, [navigate, setShowDropdown]);

    const handleClickOutside = useCallback(
        (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        },
        [setShowDropdown]
    );

    useEffect(() => {
        if (showDropdown) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => {
                document.removeEventListener('mousedown', handleClickOutside);
            };
        }
    }, [showDropdown, handleClickOutside]);

    const dropdownVariants = {
        hidden: { opacity: 0, y: -20, scale: 0.95 },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: { type: 'spring', stiffness: 300, damping: 30 },
        },
        exit: { opacity: 0, y: -20, scale: 0.95, transition: { duration: 0.2 } },
    };

    if (!showDropdown) return null;

    return (
        <Portal>
            <motion.div
                className="user-dropdown-portal"
                style={{
                    position: 'fixed',
                    top: `${position.top}px`,
                    right: `${position.right}px`,
                }}
                variants={dropdownVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                ref={dropdownRef}
            >
                <div className="user-dropdown">
                    <div className="user-dropdown__content">
                        <div className="user-info">
                            <motion.div
                                className="user-avatar"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                {user.profilePicture ? (
                                    <img src={user.profilePicture} alt="Profile" className="avatar-image" />
                                ) : (
                                    <div className="initials-avatar">
                                        {`${user.firstName[0]}${user.lastName[0]}`.toUpperCase()}
                                    </div>
                                )}
                            </motion.div>
                            <div className="user-details">
                                <motion.div className="detail-item" whileHover={{ x: 4 }}>
                                    <FaEnvelope className="detail-icon" />
                                    <span className="detail-text">{user?.email}</span>
                                </motion.div>
                                <motion.div className="detail-item" whileHover={{ x: 4 }}>
                                    <FaBirthdayCake className="detail-icon" />
                                    <span className="detail-text">
                                        {user?.birthDate ? new Date(user.birthDate).toLocaleDateString() : 'Not set'}
                                    </span>
                                </motion.div>
                                <motion.div className="detail-item" whileHover={{ x: 4 }}>
                                    <FaBriefcase className="detail-icon" />
                                    <span className="detail-text">{user?.occupation || 'Not set'}</span>
                                </motion.div>
                                <motion.div className="detail-item" whileHover={{ x: 4 }}>
                                    <FaMapMarkerAlt className="detail-icon" />
                                    <span className="detail-text">{user?.location || 'Not set'}</span>
                                </motion.div>
                            </div>
                        </div>
                        <div className="dropdown-actions">
                            <motion.button
                                className="button button-profile"
                                onClick={handleProfileClick}
                                whileHover={{ y: -1 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <FaUser className="button-icon" />
                                Profile
                            </motion.button>
                            <motion.button
                                className="button button-edit"
                                onClick={handleSettingsClick}
                                whileHover={{ y: -1 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <FaCog className="button-icon" />
                                Settings
                            </motion.button>
                            <motion.button
                                className="button button-delete"
                                onClick={handleLogout}
                                whileHover={{ y: -1 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <FiLogOut className="button-icon" />
                                Logout
                            </motion.button>
                        </div>
                    </div>
                </div>
            </motion.div>
        </Portal>
    );
});

export default UserDropdown;