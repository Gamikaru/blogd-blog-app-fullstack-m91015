// src/AppLayout.js
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';

const AppLayout = () => {
    return (
        <div className="app-layout">
            <Navbar />
            {/* Outlet is where the nested routes (e.g., HomePage, Bloggs) will render */}
            <Outlet />
        </div>
    );
};

export default AppLayout;
