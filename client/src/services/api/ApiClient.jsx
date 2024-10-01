// ApiClient.jsx
import axios from 'axios';
import Cookies from 'universal-cookie';

const cookies = new Cookies();

const ApiClient = axios.create({
   baseURL: 'http://localhost:5050',
   headers: {
      'Content-Type': 'application/json',
   },
});

ApiClient.interceptors.request.use(
   (config) => {
      const token = cookies.get('PassBloggs');

      if (token) {
         config.headers['Authorization'] = `Bearer ${token}`;
         console.log('Authorization header set');
      }

      return config;
   },
   (error) => {
      console.error('Request error:', error.message);
      return Promise.reject(error);
   }
);

ApiClient.interceptors.response.use(
   (response) => response,
   (error) => {
      const { response } = error;

      if (response && response.status === 401) {
         if (response.config.url.includes('/login')) {
            console.error('Login failed with status:', response.status, response.data);
         } else {
            console.error('Unauthorized - token may be expired or insufficient permissions');
            cookies.remove('PassBloggs');
            cookies.remove('userID');
            // Do not redirect here; let the application handle it
         }
      }

      if (response && response.status === 400) {
         console.error('Bad request:', response.data.message || 'Invalid request data');
      } else if (response && response.status >= 500) {
         console.error('Server error:', response.data.message || 'Something went wrong on the server');
      } else {
         console.error('Response error:', error.message);
      }

      return Promise.reject(error);
   }
);

export default ApiClient;
