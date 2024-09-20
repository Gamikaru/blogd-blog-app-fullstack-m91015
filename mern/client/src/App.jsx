import React from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { AppLayout, PrivateRoute } from './components/layout'; // Import AppLayout and PrivateRoute from layout barrel
import { Bloggs, HomePage, Network, Admin } from './components/features'; // Import all features from features barrel
import { UserProvider, useUser, PostProvider, ModalProvider, NotificationProvider } from './contexts'; // Import all contexts from contexts barrel
import  Logger  from './utils/Logger'; // Import Logger utility
import LoginPage from './components/auth/LoginPage'; // Import LoginPage component
import { RegisterModal } from './components/modals'; // Import RegisterModal component

/**
 * RedirectIfLoggedIn: Component to redirect users if they are already logged in.
 */
const RedirectIfLoggedIn = ({ children }) => {
   const { user, loading } = useUser() || {}; // Add fallback empty object in case of null
   Logger.info(`RedirectIfLoggedIn: User is ${user ? 'logged in' : 'not logged in'}`); // Debugging log

   if (loading) {
      return <div>Loading...</div>;  // Wait until loading is complete
   }

   // Redirect to home if the user is logged in
   return user ? <Navigate to="/" /> : children;
};

/**
 * App: Main component handling routing and user authentication context.
 */
const App = () => {
   Logger.info('App component rendered'); // Debugging log

   return (
      <UserProvider>
         <PostProvider> {/* Wrap the app with PostProvider */}
            <ModalProvider> {/* Wrap the app with ModalProvider for modal handling */}
               <NotificationProvider> {/* Wrap the app with NotificationProvider */}
                  <BrowserRouter>
                     <Routes>
                        {/* Public Routes */}
                        <Route path="/login" element={<RedirectIfLoggedIn><LoginPage /></RedirectIfLoggedIn>} />
                        <Route path="/register" element={<RedirectIfLoggedIn><RegisterModal /></RedirectIfLoggedIn>} />

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
                  </BrowserRouter>
               </NotificationProvider>
            </ModalProvider>
         </PostProvider>
      </UserProvider>
   );
};

export default App;
