// App.jsx
import { AnimatePresence } from 'framer-motion';
import React from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import 'swiper/css';
import 'swiper/css/autoplay';
import 'swiper/css/effect-cube';
import {
    LoginPage,
    RedirectIfLoggedIn,
    ErrorBoundary,
    AppLayout,
    PrivateRoute,
    PublicRoute,
    ModalManager,
    Admin,
    FullBlogView,
    HomePage,
    Network,
    UserProfile,
    Logger
} from '@components';

const App = () => {
    Logger.info('App component rendered');
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
                                    <RedirectIfLoggedIn>
                                        <LoginPage />
                                    </RedirectIfLoggedIn>
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
                            <Route path="/admin" element={<Admin />} />
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
