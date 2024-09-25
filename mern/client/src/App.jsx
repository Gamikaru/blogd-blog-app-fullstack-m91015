import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import LoginPage from './components/auth/LoginPage'; // Import LoginPage component
import { AppLayout, PrivateRoute } from './components/layout'; // Import AppLayout and PrivateRoute from layout barrel
import PostModal from './components/modals/PostModal';
import RegisterModal from './components/modals/RegisterModal';
import { Admin, Bloggs, HomePage, Network } from './components/pages'; // Import all features from features barrel
import { NotificationProvider, PostProvider, PrivateModalProvider, PublicModalProvider, usePrivateModalContext, usePublicModalContext, UserProvider } from './contexts'; // Import context providers and hooks
import { useUser } from './contexts/UserContext'; // Import user context
import Logger from './utils/Logger'; // Import Logger utility

/**
 * RedirectIfLoggedIn: Component to redirect users if they are already logged in.
 */
const RedirectIfLoggedIn = ({ children }) => {
   const { user, loading } = useUser() || {}; // Add fallback empty object in case of null
   Logger.info(`RedirectIfLoggedIn: User is ${user ? 'logged in' : 'not logged in'}`); // Debugging log

   if (loading) {
      Logger.info('RedirectIfLoggedIn: Loading user data...');
      return <div>Loading...</div>;  // Wait until loading is complete
   }

   // Redirect to home if the user is logged in
   Logger.info(`RedirectIfLoggedIn: ${user ? 'Redirecting to home' : 'Rendering children'}`);
   return user ? <Navigate to="/" /> : children;
};

/**
 * ModalManager: Handles rendering of modals based on context values.
 */
const ModalManager = () => {
   const { modalType: publicModalType, showModal: showPublicModal } = usePublicModalContext();
   const { modalType: privateModalType, showModal: showPrivateModal } = usePrivateModalContext();

   return (
      <>
         {/* Conditionally render public modals */}
         {showPublicModal && publicModalType === 'register' && <RegisterModal />}

         {/* Conditionally render private modals */}
         {showPrivateModal && privateModalType === 'post' && <PostModal />}
      </>
   );
};

/**
 * App: Main component handling routing and user authentication context.
 */
const App = () => {
   Logger.info('App component rendered'); // Debugging log

   return (
      <PublicModalProvider> {/* Wrap the app with PublicModalProvider for public modals */}
         <UserProvider>
            <PostProvider> {/* Wrap the app with PostProvider */}
               <PrivateModalProvider> {/* Wrap the app with PrivateModalProvider for private modals */}
                  <NotificationProvider> {/* Wrap the app with NotificationProvider */}
                     <BrowserRouter>
                        <Routes>
                           {/* Public Routes */}
                           <Route path="/login" element={<RedirectIfLoggedIn><LoginPage /></RedirectIfLoggedIn>} />

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
                              <Route path="/bloggs" element={<Bloggs />} />
                              <Route path="/admin" element={<Admin />} />
                              <Route path="/network" element={<Network />} />
                              <Route path="*" element={<h1>Page Not Found</h1>} /> {/* Simple fallback */}
                           </Route>
                        </Routes>

                        {/* Modal Manager handles rendering modals based on context */}
                        <ModalManager />
                     </BrowserRouter>
                  </NotificationProvider>
               </PrivateModalProvider>
            </PostProvider>
         </UserProvider>
      </PublicModalProvider>
   );
};

export default App;
