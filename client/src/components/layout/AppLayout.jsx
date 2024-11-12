// src/layouts/AppLayout.jsx

import { Footer, Navbar, Sidebar } from '@components'; // Adjust the import path if necessary
import { useNotificationContext } from '@contexts';
import { logger } from '@utils'; // Adjust the import path if necessary
import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';

const AppLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const toggleButtonRef = useRef(null);
    const { setPosition, notification } = useNotificationContext();
    const location = useLocation();

    const pageVariants = useMemo(
        () => ({
            initial: { opacity: 0, y: 20 },
            in: { opacity: 1, y: 0 },
            out: { opacity: 0, y: -20 },
        }),
        []
    );

    const pageTransition = useMemo(
        () => ({
            type: 'tween',
            ease: 'easeInOut',
            duration: 0.8,
        }),
        []
    );

    const toggleSidebar = useCallback(() => {
        logger.info('[AppLayout] Toggling sidebar');
        setSidebarOpen((prev) => !prev);
    }, []);

    useEffect(() => {
        setPosition(notification.type, true);
        return () => {
            logger.info('[AppLayout] Component unmounted');
        };
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
