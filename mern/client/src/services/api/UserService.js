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
         const response = await ApiClient.put(`/user/${userId}/status`, { status });
         return response.data;
      } catch (error) {
         console.error('Error updating user status:', error);
         throw error;
      }
   },

   // Other user-related services can go here, such as fetching or deleting a user.
};

export default UserService;
