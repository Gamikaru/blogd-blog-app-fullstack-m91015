// src/layouts/AppLayout.jsx

import { Footer, Navbar, Sidebar } from '@components';
import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';

const pageVariants = {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -20 },
};

const pageTransition = {
    type: 'tween',
    ease: 'easeInOut',
    duration: 0.8,
};

const AppLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const toggleSidebar = useCallback(() => {
        setSidebarOpen((prev) => !prev);
    }, []);

    const location = useLocation();

    return (
        <div className="app-layout">
            <Navbar toggleSidebar={toggleSidebar} />
            <Sidebar sidebarOpen={sidebarOpen} handleSidebarClose={() => setSidebarOpen(false)} />
            <main className="main-content">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={location.pathname}
                        variants={pageVariants}
                        initial="initial"
                        animate="in"
                        exit="out"
                        transition={pageTransition}
                        className="page-container"
                    >
                        <Outlet />
                    </motion.div>
                </AnimatePresence>
            </main>
            <Footer />
        </div>
    );
};

export default AppLayout;
