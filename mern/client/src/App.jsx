import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AppLayout from './AppLayout';
import Admin from './components/Admin';
import Bloggs from './components/Bloggs';
import HomePage from './components/HomePage';
import LoginPage from './components/LoginPage';
import Network from './components/Network';
import RegisterModal from './components/RegisterModal';
import PrivateRoute from './PrivateRoute';
import { UserProvider } from './UserContext'; // Import the UserProvider

const App = () => {
  return (
    <UserProvider> {/* Wrap entire app in UserProvider */}
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterModal />} />

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
            <Route path="*" element={<h1>Not Found</h1>} />
            <Route path="/network" element={<Network />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
};

export default App;
