import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import React, { forwardRef } from 'react';

const HamburgerMenu = forwardRef(({ isOpen, handleSidebarToggle }, ref) => {
    // const iconVariants = {
    //     hover: { scale: 1.1 },
    //     tap: { scale: 0.95 },
    // };

    const line1Variants = {
        closed: { rotate: 0, y: 0 },
        open: { rotate: 45, y: 6 },
    };

    const line2Variants = {
        closed: { opacity: 1 },
        open: { opacity: 0 },
    };

    const line3Variants = {
        closed: { rotate: 0, y: 0 },
        open: { rotate: -45, y: -6 },
    };

    return (
        <motion.button
            ref={ref}
            className="hamburger-icon"
            onClick={handleSidebarToggle}
            aria-label="Toggle Sidebar"
            whileHover="hover"
            whileTap="tap"
            initial="closed"
            animate={isOpen ? 'open' : 'closed'}
        >
            <motion.span
                className="line line1"
                variants={line1Variants}
                transition={{ duration: 0.3 }}
            ></motion.span>
            <motion.span
                className="line line2"
                variants={line2Variants}
                transition={{ duration: 0.3 }}
            ></motion.span>
            <motion.span
                className="line line3"
                variants={line3Variants}
                transition={{ duration: 0.3 }}
            ></motion.span>
        </motion.button>
    );
});

HamburgerMenu.displayName = 'HamburgerMenu';

HamburgerMenu.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    handleSidebarToggle: PropTypes.func.isRequired,
};

export default React.memo(HamburgerMenu);