import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import App from './App';
import 'bootstrap/scss/bootstrap.scss'; // Import Bootstrap's SCSS
import './scss/main.scss'; // Import your global SCSS file

/**
 * main.jsx: The entry point of the application where React renders the App component.
 */
ReactDOM.createRoot(document.getElementById('root')).render(
   <React.Fragment>
      <App />
   </React.Fragment>
);
