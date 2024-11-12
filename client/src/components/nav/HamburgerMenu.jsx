// src/components/nav/HamburgerMenu.jsx

import { motion } from 'framer-motion';
import React from 'react';

const HamburgerMenu = React.memo(({ sidebarOpen, handleSidebarToggle, toggleButtonRef }) => {
  const iconVariants = {
    hover: { scale: 1.1 },
    tap: { scale: 0.95 },
  };

  const hamburgerVariants = {
    open: { rotate: 45, y: 5 },
    closed: { rotate: 0, y: 0 },
  };

  const hamburgerLineVariants = {
    open: { opacity: 0 },
    closed: { opacity: 1 },
  };

  return (
    <motion.button
      ref={toggleButtonRef}
      className="hamburger-icon"
      onClick={handleSidebarToggle}
      aria-label="Toggle Sidebar"
      whileHover="hover"
      whileTap="tap"
      variants={iconVariants}
    >
      <motion.span
        className="line"
        variants={hamburgerVariants}
        animate={sidebarOpen ? 'open' : 'closed'}
        transition={{ duration: 0.3 }}
      ></motion.span>
      <motion.span
        className="line"
        variants={hamburgerLineVariants}
        animate={sidebarOpen ? 'open' : 'closed'}
        transition={{ duration: 0.3 }}
      ></motion.span>
      <motion.span
        className="line"
        variants={{
          open: { rotate: -45, y: -5 },
          closed: { rotate: 0, y: 0 },
        }}
        animate={sidebarOpen ? 'open' : 'closed'}
        transition={{ duration: 0.3 }}
      ></motion.span>
    </motion.button>
  );
});

export default HamburgerMenu;