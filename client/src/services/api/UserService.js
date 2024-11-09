// services/api/UserService.js

import { ApiClient, Logger } from '@components';

class UserService {
    /**
     * Update user status by user ID
     * @param {string} userId - The ID of the user
     * @param {string} status - The new status to update
     * @returns {Promise<Object>} - The updated user data
     */
    static async updateUserStatus(userId, status) {
        try {
            // Ensure this is a PUT request
            const response = await ApiClient.put(`/user/${userId}/status`, { status });
            return response.data;
        } catch (error) {
            Logger.error('Error updating user status:', error);
            throw error;
        }
    }

    /**
     * Register a new user
     * @param {Object} userData - The data for the new user
     * @returns {Promise<Object>} - The created user data or error message
     */
    static async registerUser(userData) {
        try {
            const response = await ApiClient.post("/user/register", userData);
            Logger.info('User registered:', response.data);
            return response.data;
        } catch (error) {
            Logger.error('Error registering user:', error);
            throw error.response?.data || { message: 'Registration failed' };
        }
    }

    /**
     * Login user
     * @param {Object} loginData - The login credentials
     * @returns {Promise<Object>} - The logged-in user data or error message
     */
    static async loginUser(loginData) {
        try {
            const response = await ApiClient.post("/user/login", loginData);
            Logger.info('User logged in:', response.data);
            return response.data;
        } catch (error) {
            Logger.error('Error logging in user:', error);

            // Explicitly check if error.response exists and pass the message back
            if (error.response && error.response.data) {
                Logger.error('Error details from server:', error.response.data);
                throw new Error(error.response.data.message || 'Login failed. Please try again.');
            } else {
                // Handle cases where no detailed response is available
                throw new Error('An unexpected error occurred during login.');
            }
        }
    }

    /**
     * Send password reset email
     * @param {string} email - The email of the user
     * @returns {Promise<Object>} - The response data or error message
     */
    static async sendPasswordResetEmail(email) {
        try {
            const response = await ApiClient.post("/user/forgot-password", { email });
            Logger.info('Password reset email sent:', response.data);
            return response.data;
        } catch (error) {
            Logger.error('Error sending password reset email:', error);
            throw error.response?.data || { message: 'Failed to send password reset email' };
        }
    }

    /**
     * Reset password
     * @param {string} token - The reset token
     * @param {string} newPassword - The new password
     * @returns {Promise<Object>} - The response data or error message
     */
    static async resetPassword(token, newPassword) {
        try {
            const response = await ApiClient.post("/user/reset-password", { token, newPassword });
            Logger.info('Password reset successful:', response.data);
            return response.data;
        } catch (error) {
            Logger.error('Error resetting password:', error);
            throw error.response?.data || { message: 'Failed to reset password' };
        }
    }

    /**
     * Fetch user by ID
     * @param {string} userId - The ID of the user
     * @returns {Promise<Object>} - The user data or error message
     */
    static async fetchUserById(userId) {
        try {
            const response = await ApiClient.get(`/user/${userId}`);
            Logger.info('Fetched user by ID:', response.data);
            return response.data;
        } catch (error) {
            Logger.error('Error fetching user by ID:', error);
            throw error.response?.data || { message: 'Failed to fetch user' };
        }
    }

    /**
     * Fetch all users
     * @returns {Promise<Array>} - The list of users or error message
     */
    static async fetchAllUsers() {
        try {
            const response = await ApiClient.get("/user");
            Logger.info('Fetched all users:', response.data);
            return response.data;
        } catch (error) {
            Logger.error('Error fetching all users:', error);
            throw error.response?.data || { message: 'Failed to fetch users' };
        }
    }

    /**
     * Update user by ID
     * @param {string} userId - The ID of the user
     * @param {Object} userData - The data to update
     * @returns {Promise<Object>} - The updated user data or error message
     */
    static async updateUserById(userId, userData) {
        try {
            const response = await ApiClient.patch(`/user/${userId}`, userData);
            Logger.info('Updated user by ID:', response.data);
            return response.data;
        } catch (error) {
            Logger.error('Error updating user by ID:', error);
            throw error.response?.data || { message: 'Failed to update user' };
        }
    }

    /**
     * Delete user by ID
     * @param {string} userId - The ID of the user
     * @returns {Promise<Object>} - The response data or error message
     */
    static async deleteUserById(userId) {
        try {
            const response = await ApiClient.delete(`/user/${userId}`);
            Logger.info('Deleted user by ID:', response.data);
            return response.data;
        } catch (error) {
            Logger.error('Error deleting user by ID:', error);
            throw error.response?.data || { message: 'Failed to delete user' };
        }
    }

    /**
     * Delete user by email
     * @param {string} email - The email of the user
     * @returns {Promise<Object>} - The response data or error message
     */
    static async deleteUserByEmail(email) {
        try {
            const response = await ApiClient.delete(`/user/email/${email}`);
            Logger.info('Deleted user by email:', response.data);
            return response.data;
        } catch (error) {
            Logger.error('Error deleting user by email:', error);
            throw error.response?.data || { message: 'Failed to delete user' };
        }
    }

    /**
     * Logout user
     * @returns {Promise<Object>} - The response data or error message
     */
    static async logoutUser() {
        try {
            const response = await ApiClient.post("/user/logout");
            Logger.info('User logged out:', response.data);
            return response.data;
        } catch (error) {
            Logger.error('Error logging out user:', error);
            throw error.response?.data || { message: 'Failed to logout user' };
        }
    }

    static async getUserProfile(userId) {
        try {
            const response = await ApiClient.get(`/user/${userId}`);
            return response.data;
        } catch (error) {
            Logger.error('Error fetching user profile:', error);
            throw error;
        }
    }

    static async updateProfile(userId, profileData) {
        try {
            const response = await ApiClient.patch(`/user/${userId}`, profileData);
            return response.data;
        } catch (error) {
            Logger.error('Error updating profile:', error);
            throw error;
        }
    }
}

export default UserService;