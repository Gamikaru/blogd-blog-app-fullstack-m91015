// ApiClient.js
import axios from 'axios';
import Cookies from 'universal-cookie';

const cookies = new Cookies();

// Create an Axios instance with a base URL for your API
const ApiClient = axios.create({
    baseURL: 'http://localhost:5050', // This should be the base URL of your API
    headers: {
        'Content-Type': 'application/json', // Default headers for all requests
    },
});

// Add a request interceptor to attach the Authorization token
ApiClient.interceptors.request.use(
    (config) => {
        // Retrieve the token from cookies
        const token = cookies.get('PassBloggs');

        // If token exists, attach it to the Authorization header
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        // Handle any request errors
        return Promise.reject(error);
    }
);

// Add a response interceptor (optional) to handle errors globally
ApiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        // Handle response errors globally
        if (error.response && error.response.status === 401) {
            // Handle unauthorized (token might be expired, redirect to login, etc.)
            console.error('Unauthorized - possibly token expired');
            // You might want to clear cookies and redirect to login page here
        }
        return Promise.reject(error);
    }
);

export default ApiClient; // Ensure you export the correct variable
