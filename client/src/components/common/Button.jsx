// src/components/common/Button.jsx

import clsx from 'clsx';
import { motion, useReducedMotion } from 'framer-motion';
import PropTypes from 'prop-types';
import React, { useMemo } from 'react';

// Import icons
import {
    FiArrowUpCircle,
    FiBook,
    FiEdit,
    FiFeather,
    FiFileText,
    FiHeart,
    FiLink,
    FiLogIn,
    FiLogOut,
    FiMessageCircle,
    FiPlus,
    FiSearch,
    FiSend,
    FiSettings,
    FiShare2,
    FiTrash,
    FiUser,
    FiX,
    FiXCircle
} from 'react-icons/fi';

import {
    FaBlog,
    FaBookOpen,
    FaCog,
    FaFacebookF,
    FaInstagram,
    FaLinkedinIn,
    FaPaperPlane,
    FaTwitter
} from 'react-icons/fa';

import {
    MdConnectWithoutContact,
    MdNotifications,
    MdOutlineChat,
} from 'react-icons/md';

// Centralized variant-to-icon mapping
const variantIcons = {
    // Feather Icons
    edit: FiEdit,
    delete: FiTrash,
    submit: null,
    login: FiLogIn,
    logout: FiLogOut,
    create: FiPlus,
    close: FiX,
    like: FiHeart,
    search: FiSearch,
    feather: FiFeather,
    profile: FiUser,
    upgrade: FiArrowUpCircle,
    share: FiShare2,
    link: FiLink,
    message: FiMessageCircle,
    send: FiSend, // Added send icon
    book: FiBook,
    fileText: FiFileText,
    reset: FiXCircle,
    settings2: FiSettings,
    // settings: FiCog,

    // Font Awesome Icons
    twitter: FaTwitter,
    facebook: FaFacebookF,
    instagram: FaInstagram,
    linkedin: FaLinkedinIn,
    blog: FaBlog,
    bookOpen: FaBookOpen,
    paperPlane: FaPaperPlane,
    settings: FaCog, // Ensure 'settings' is included

    // Material Design Icons
    notifications: MdNotifications,
    chat: MdOutlineChat,
    connect: MdConnectWithoutContact,

    // Additional Variants
    noIcon: null,
    iconButton: null, // Handled via icon prop
};

// Mapping button variants to SCSS classes
const variantClasses = {
    profile: 'button-profile',
    edit: 'button-edit',
    delete: 'button-delete',
    create: 'button-create',
    submit: 'button-submit',
    login: 'button-login',
    logout: 'button-logout',
    replace: 'button-edit',
    send: 'button-send', // Added send variant
    settings: 'button-settings', // Added settings variant
    settings2: 'button-settings2', // Added settings2 variant
    iconButton: 'icon-only', // Map 'iconButton' to 'icon-only' class
};

const Button = React.memo(
    ({
        variant = 'submit',
        children,
        icon,
        showIcon = true,
        theme = 'light',
        as: Component = 'button',
        iconOnly = false,
        filled = false,
        'aria-label': ariaLabel,
        ...props
    }) => {
        const shouldReduceMotion = useReducedMotion();

        // Determine the icon component to use
        const IconComponent = useMemo(() => icon || variantIcons[variant], [icon, variant]);

        // Determine motion properties
        const motionProps =
            variant === 'iconButton' && !shouldReduceMotion
                ? {}
                : {
                    whileHover: { scale: 1.01, transition: { duration: 0.2 } },
                    whileTap: { scale: 0.99, transition: { duration: 0.1 } },
                };

        return (
            <motion.div {...motionProps}>
                <Component
                    className={clsx(
                        'button',
                        variantClasses[variant],
                        theme,
                        {
                            'icon-only': iconOnly || variant === 'iconButton',
                            filled,
                        }
                    )}
                    aria-label={ariaLabel || variant}
                    {...props}
                >
                    {showIcon && IconComponent && <IconComponent className="button-icon" />}
                    {!iconOnly && children && <span className="button-text">{children}</span>}
                </Component>
            </motion.div>
        );
    }
);

Button.displayName = 'Button';

Button.propTypes = {
    variant: PropTypes.oneOf(Object.keys(variantClasses)),
    children: PropTypes.node,
    icon: PropTypes.elementType,
    showIcon: PropTypes.bool,
    theme: PropTypes.oneOf(['light', 'dark']),
    as: PropTypes.elementType,
    iconOnly: PropTypes.bool,
    filled: PropTypes.bool,
    'aria-label': PropTypes.string,
};

export default Button;