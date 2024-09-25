import axios from 'axios';
import Cookies from 'universal-cookie';

const cookies = new Cookies();

// Create an Axios instance with a base URL for your API
const ApiClient = axios.create({
   baseURL: 'http://localhost:5050', // Ensure this is correct based on your environment (update for production)
   headers: {
      'Content-Type': 'application/json', // Set default headers for JSON API requests
   },
});

// Request Interceptor: Attach Authorization token to headers if it exists in cookies
ApiClient.interceptors.request.use(
   (config) => {
      const token = cookies.get('PassBloggs'); // Retrieve token from cookies

      // If a token exists, add it to the Authorization header
      if (token) {
         config.headers['Authorization'] = `Bearer ${token}`;
         console.log('Authorization header set'); // For debugging, avoid logging actual tokens for security reasons
      }

      return config; // Proceed with the request
   },
   (error) => {
      // Handle request errors globally
      console.error('Request error:', error.message); // Log the error message for debugging
      return Promise.reject(error); // Ensure the error propagates to the caller
   }
);

// Response Interceptor: Handle responses globally, especially for errors
ApiClient.interceptors.response.use(
   (response) => response, // Directly return successful responses to the caller
   (error) => {
      const { response } = error;

      // Check if the error is due to unauthorized or forbidden requests (e.g., token expired or invalid)
      if (response && (response.status === 401 || response.status === 403)) {
         console.error('Unauthorized - token may be expired or insufficient permissions');
         cookies.remove('PassBloggs'); // Remove the token from cookies
         window.location.href = '/login'; // Redirect the user to the login page to re-authenticate
      }

      // Additional error handling for other cases (e.g., 400, 500)
      if (response && response.status === 400) {
         console.error('Bad request:', response.data.message || 'Invalid request data');
      } else if (response && response.status >= 500) {
         console.error('Server error:', response.data.message || 'Something went wrong on the server');
      } else {
         console.error('Response error:', error.message); // Catch-all for other errors
      }

      // Always reject the promise to ensure errors are handled in the calling functions
      return Promise.reject(error);
   }
);

export default ApiClient;
