import React from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import AppLayout from './AppLayout';
import Admin from './components/Admin';
import Bloggs from './components/Bloggs';
import HomePage from './components/HomePage';
import LoginPage from './components/LoginPage';
import Network from './components/Network';
import RegisterModal from './components/RegisterModal';
import PrivateRoute from './PrivateRoute';
import { UserProvider, useUser } from './UserContext';

/**
 * RedirectIfLoggedIn: Component to redirect users if they are already logged in.
 */
const RedirectIfLoggedIn = ({ children }) => {
  const { user, loading } = useUser() || {}; // Add fallback empty object in case of null
  console.log('RedirectIfLoggedIn: user', user); // Debugging log

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
  console.log('App component rendered'); // Debugging log

  return (
    <UserProvider>
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
            <Route path="*" element={<h1>Page Not Found</h1>} /> {/* Simple fallback */}
            <Route path="/network" element={<Network />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
};

export default App;
