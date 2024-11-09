// AppLayout.jsx
// Desc: Main layout component for the app
import { Logger, Navbar, Sidebar, useNotificationContext } from '@components';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';

const AppLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const toggleButtonRef = useRef(null);
    const { setPosition, notification } = useNotificationContext();
    const location = useLocation();

    const toggleSidebar = useCallback(() => {
        Logger.info(`Toggling sidebar to ${!sidebarOpen}`);
        setSidebarOpen((prevState) => !prevState);
    }, [sidebarOpen]);

    useEffect(() => {
        Logger.info(
            'AppLayout mounted and setting toast position based on notification type'
        );
        setPosition(notification.type, true);

        return () => {
            Logger.info('AppLayout unmounted');
        };
    }, [setPosition, notification.type]);

    // Animation variants for page transitions
    const pageVariants = {
        initial: {
            opacity: 0,
            y: 20,
        },
        in: {
            opacity: 1,
            y: 0,
        },
        out: {
            opacity: 0,
            y: -20,
        },
    };

    // Transition settings
    const pageTransition = {
        type: 'tween',
        ease: 'easeInOut',
        duration: 0.8,
    };

    return (
        <div className="app-layout">
            <Navbar toggleSidebar={toggleSidebar} toggleButtonRef={toggleButtonRef} />
            <Sidebar
                sidebarOpen={sidebarOpen}
                toggleSidebar={toggleSidebar}
                toggleButtonRef={toggleButtonRef}
            />
            <AnimatePresence mode="wait">
                <motion.div
                    key={location.pathname}
                    variants={pageVariants}
                    initial="initial"
                    animate="in"
                    exit="out"
                    transition={pageTransition}
                    style={{ position: 'relative' }}
                >
                    <Outlet />
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default AppLayout;
