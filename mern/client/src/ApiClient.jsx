import axios from 'axios';
import Cookies from 'universal-cookie';

const cookies = new Cookies();

// Create an Axios instance with a base URL for your API
const ApiClient = axios.create({
    baseURL: 'http://localhost:5050', // Make sure this baseURL is correct when deploying
    headers: {
        'Content-Type': 'application/json', // Default headers for all requests
    },
});

// Add a request interceptor to attach the Authorization token
ApiClient.interceptors.request.use(
    (config) => {
        const token = cookies.get('PassBloggs'); // Retrieve token from cookies

        // Attach token to Authorization header if available
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
            console.log('Authorization header set'); // No need to log the actual token for security
        }

        return config;
    },
    (error) => {
        // Handle request errors
        console.error('Request error:', error.message); // Log error message
        return Promise.reject(error);
    }
);

// Add a response interceptor to handle errors globally
ApiClient.interceptors.response.use(
    (response) => response, // Successful response
    (error) => {
        // Handle response errors globally
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            console.error('Unauthorized - possibly token expired or insufficient permissions');
            cookies.remove('PassBloggs'); // Clear token from cookies
            window.location.href = '/login'; // Redirect to login page
        }

        console.error('Response error:', error.message); // Log error message
        return Promise.reject(error);
    }
);

export default ApiClient;
