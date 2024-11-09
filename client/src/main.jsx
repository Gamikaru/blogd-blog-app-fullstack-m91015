// main.jsx
import 'bootstrap/scss/bootstrap.scss';
import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import 'swiper/css'; // Global swiper styles
import App from './App';
import { Providers } from './Providers';
import './scss/main.scss';
// CubeSlider.jsx (local to CubeSlider)






ReactDOM.createRoot(document.getElementById('root')).render(
    <BrowserRouter>
        <Providers>
            <App />
        </Providers>
    </BrowserRouter>
);

