// services/api/UserService.js

import Logger from '../../utils/Logger'; // Import Logger utility
import ApiClient from './ApiClient'; // Assuming you have an ApiClient set up for Axios

const UserService = {
   /**
    * Update user status by user ID
    * @param {string} userId - The ID of the user
    * @param {string} status - The new status to update
    * @returns {Promise<Object>} - The updated user data
    */
   async updateUserStatus(userId, status) {
      try {
         // Ensure this is a PUT request
         const response = await ApiClient.put(`/user/${userId}/status`, { status });
         return response.data;
      } catch (error) {
         Logger.error('Error updating user status:', error);
         throw error;
      }
   },


   /**
    * Register a new user
    * @param {Object} userData - The data for the new user
    * @returns {Promise<Object>} - The created user data or error message
    */
   async registerUser(userData) {
      try {
         const response = await ApiClient.post("/user/register", userData);
         Logger.info('User registered:', response.data);
         return response.data;
      } catch (error) {
         Logger.error('Error registering user:', error);
         throw error.response?.data || { message: 'Registration failed' };
      }
   },

   /**
   * Login user
   * @param {Object} loginData - The login credentials
   * @returns {Promise<Object>} - The logged-in user data or error message
   */
   async loginUser(loginData) {
      try {

         const response = await ApiClient.post("/user/login", loginData);
         Logger.info('User logged in:', response.data);
         return response.data;
      } catch (error) {
         Logger.error('Error logging in user:', error);
         throw error.response?.data || { message: 'Login failed' };
      }
   }

   // Add more user-related services here if needed
};

export default UserService;
