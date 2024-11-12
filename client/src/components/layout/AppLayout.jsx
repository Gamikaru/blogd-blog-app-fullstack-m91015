// src/layouts/AppLayout.jsx

import { Footer, Navbar, Sidebar } from '@components';
import { useNotificationContext } from '@contexts';
import { logger } from '@utils';
import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';
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
    const toggleButtonRef = useRef(null);
    const { setPosition, notification } = useNotificationContext();
    const location = useLocation();

    const toggleSidebar = useCallback(() => {
        logger.info('[AppLayout] Toggling sidebar');
        setSidebarOpen((prev) => !prev);
    }, []);

    useEffect(() => {
        setPosition(notification.type, true);
    }, [setPosition, notification.type]);

    return (
        <div className="app-layout">
            <Navbar toggleSidebar={toggleSidebar} toggleButtonRef={toggleButtonRef} />
            <Sidebar
                sidebarOpen={sidebarOpen}
                toggleSidebar={toggleSidebar}
                toggleButtonRef={toggleButtonRef}
            />
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
