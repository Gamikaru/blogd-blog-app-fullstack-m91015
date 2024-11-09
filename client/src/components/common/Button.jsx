// client/src/components/common/Button.jsx
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import React from 'react';
import {
    FiArrowUpCircle,
    FiBook,
    FiCheck,
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
    FiShare2,
    FiTrash,
    FiUser,
    FiX,
} from 'react-icons/fi';

import {
    FaBlog,
    FaBookOpen,
    FaFacebookF,
    FaInstagram,
    FaLinkedinIn,
    FaPaperPlane,
    FaTwitter,
} from 'react-icons/fa';

import {
    MdConnectWithoutContact,
    MdNotifications,
    MdOutlineChat,
} from 'react-icons/md';

const variantIcons = {
    // Feather Icons
    edit: FiEdit,
    delete: FiTrash,
    submit: FiCheck,
    login: FiLogIn,
    logout: FiLogOut,
    create: FiPlus,
    close: FiX,
    like: FiHeart,
    search: FiSearch,
    feather: FiFeather,
    user: FiUser,
    upgrade: FiArrowUpCircle,
    share: FiShare2,
    link: FiLink,
    message: FiMessageCircle,
    send: FiSend,
    book: FiBook,
    fileText: FiFileText,

    // Font Awesome Icons
    twitter: FaTwitter,
    facebook: FaFacebookF,
    instagram: FaInstagram,
    linkedin: FaLinkedinIn,
    blog: FaBlog,
    bookOpen: FaBookOpen,
    paperPlane: FaPaperPlane,

    // Material Design Icons
    notifications: MdNotifications,
    chat: MdOutlineChat,
    connect: MdConnectWithoutContact,

    // Additional Variants
    noIcon: null,
    iconButton: null, // For unique or rare icons
};

const Button = ({
    variant,
    children,
    icon,
    showIcon = true,
    theme,
    as,
    ...props
}) => {
    const IconComponent = icon || variantIcons[variant];
    const Component = as || 'button'; // Allows rendering as different elements (e.g., 'a')

    return (
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Component className={`button button-${variant} ${theme}`} {...props}>
                {showIcon && IconComponent && (
                    <IconComponent className="button-icon" />
                )}
                {children}
            </Component>
        </motion.div>
    );
};

Button.propTypes = {
    variant: PropTypes.oneOf([
        // Feather Icons
        'edit',
        'delete',
        'submit',
        'login',
        'logout',
        'create',
        'close',
        'like',
        'search',
        'feather',
        'user',
        'upgrade',
        'share',
        'link',
        'message',
        'send',
        'book',
        'fileText',

        // Font Awesome Icons
        'twitter',
        'facebook',
        'instagram',
        'linkedin',
        'blog',
        'bookOpen',
        'paperPlane',

        // Material Design Icons
        'notifications',
        'chat',
        'connect',

        // Additional Variants
        'noIcon',
        'iconButton',
    ]).isRequired,
    children: PropTypes.node,
    icon: PropTypes.elementType, // Allows overriding the default icon
    showIcon: PropTypes.bool, // Allows toggling the icon on or off
    theme: PropTypes.oneOf(['light', 'dark']),
    as: PropTypes.elementType, // Allows rendering as a different element
};

Button.defaultProps = {
    theme: 'light',
    showIcon: true, // Default to showing the icon
};

export default Button;