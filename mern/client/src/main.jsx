// src/main.js
import 'bootstrap/scss/bootstrap.scss'; // Import Bootstrap SCSS instead of CSS
import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import App from './App';

// Inter Font import
const fontLink = document.createElement('link');
fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap';
fontLink.rel = 'stylesheet';
document.head.appendChild(fontLink);


ReactDOM.createRoot(document.getElementById('root')).render(
	<React.StrictMode>
		<App />
	</React.StrictMode>
);
