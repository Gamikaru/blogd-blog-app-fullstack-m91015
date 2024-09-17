import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import App from './App';
import 'bootstrap/scss/bootstrap.scss'; // Import Bootstrap's SCSS
import './scss/main.scss'; // Import your global SCSS file

ReactDOM.createRoot(document.getElementById('root')).render(
	<React.StrictMode>
		<App />
	</React.StrictMode>
);
