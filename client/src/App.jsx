// src/App.jsx

import {
    // Admin,
    AppLayout,
    ErrorBoundary,
    FullBlogView,
    HomePage,
    LoginPage,
    ModalManager,
    Network,
    PrivateRoute,
    PublicRoute,
    UserProfile
} from '@components';
import { logger } from '@utils';
import { AnimatePresence } from 'framer-motion';
import { Route, Routes, useLocation } from 'react-router-dom';
import 'swiper/css';
import 'swiper/css/autoplay';
import 'swiper/css/effect-cube';

const App = () => {
    logger.info('App component rendered');
    const location = useLocation();

    return (
        <>
            <ErrorBoundary>
                <AnimatePresence mode="wait">
                    <Routes location={location} key={location.pathname}>
                        {/* Public Routes */}
                        <Route
                            path="/login"
                            element={
                                <PublicRoute>
                                    <LoginPage />
                                </PublicRoute>
                            }
                        />

                        {/* Private Routes */}
                        <Route
                            path="/"
                            element={
                                <PrivateRoute>
                                    <AppLayout />
                                </PrivateRoute>
                            }
                        >
                            <Route path="/" element={<HomePage />} />
                            {/* <Route path="/admin" element={<Admin />} /> */}
                            <Route path="/network" element={<Network />} />
                            <Route path="/blog/:id" element={<FullBlogView />} />
                            <Route path="/profile" element={<UserProfile />} />
                            <Route path="/profile/:userId" element={<UserProfile />} />
                            <Route path="*" element={<h1>Page Not Found</h1>} />
                        </Route>
                    </Routes>
                </AnimatePresence>
                <ModalManager />
            </ErrorBoundary>
        </>
    );
};

export default App;