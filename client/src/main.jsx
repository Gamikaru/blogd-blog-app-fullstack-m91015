// src/main.jsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import Providers from './Providers'; // Adjust the import path if necessary

// Import styles
import 'bootstrap/scss/bootstrap.scss';
import 'swiper/css'; // Global swiper styles
import './scss/main.scss';

// Select the root container
const container = document.getElementById('root');

// Create a root.
const root = ReactDOM.createRoot(container);

// In your main index.js or App.jsx
navigator.serviceWorker.getRegistrations().then((registrations) => {
    registrations.forEach((registration) => {
        registration.unregister();
    });
});

// Initial render: Render the <App /> wrapped with providers.
root.render(
    <React.StrictMode>
        <Providers>
            <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
                <App />
            </BrowserRouter>
        </Providers>
    </React.StrictMode>
);
