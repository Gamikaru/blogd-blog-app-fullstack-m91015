// src/main.jsx

// Remove the React import if it's not used directly
// import React from 'react'; // Remove this line
import React from 'react'; // Add this line
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import Providers from './Providers';

// Import styles
// import 'bootstrap/scss/bootstrap.scss';
import 'swiper/css'; // Global swiper styles
import './scss/main.scss';

// Select the root container
const container = document.getElementById('root');

// Create a root.
const root = ReactDOM.createRoot(container);

// Unregister any existing service workers
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