// src/layouts/AppLayout.jsx

import { Footer, Navbar, Sidebar } from '@components';
import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useEffect, useState } from 'react';
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

    // State and effect for back-to-top button
    const [showBackToTop, setShowBackToTop] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            console.log('Scroll Y:', window.scrollY); // Debug scroll
            if (window.scrollY > 200) {
                setShowBackToTop(true);
            } else {
                setShowBackToTop(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleBackToTop = useCallback(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

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

            {/* Back to top button */}
            {showBackToTop && (
                <button className="back-to-top" onClick={handleBackToTop}>
                    ↑
                </button>
            )}
        </div>
    );
};

export default AppLayout;
