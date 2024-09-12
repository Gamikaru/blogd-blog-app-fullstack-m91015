// src/main.js
import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import App from './App';

// Global styles
import './styles/button.css';
import './styles/date_selector.css';
import './styles/dropdown.css';
import './styles/font.css';
import './styles/form.css';
import './styles/input_field.css';
import './styles/main_content.css';
import './styles/modal.css';
import './styles/table.css';



ReactDOM.createRoot(document.getElementById('root')).render(
	<React.StrictMode>
		<App />
	</React.StrictMode>
);
