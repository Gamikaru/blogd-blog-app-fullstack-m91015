// services/api/UserService.js

import logger from '../../utils/logger';
import ApiClient from './ApiClient';

class UserService {
    /**
     * Update user status by user ID
     * @param {string} userId - The ID of the user
     * @param {string} status - The new status to update
     * @returns {Promise<Object>} - The updated user data
     */
    static async updateUserStatus(userId, status) {
        logger.info(`Updating status for user ID: ${userId}`);
        try {
            const response = await ApiClient.put(`/user/${userId}/status`, { status });
            logger.info(`Status updated successfully for user ID: ${userId}`);
            return response.data;
        } catch (error) {
            logger.error(`Error updating status for user ID: ${userId}`, error);
            throw error;
        }
    }

    /**
     * Register a new user
     * @param {Object} userData - The data for the new user
     * @returns {Promise<Object>} - The created user data or error message
     */
    static async registerUser(userData) {
        logger.info('Registering new user with data:', userData);
        try {
            const response = await ApiClient.post("/user/register", userData);
            logger.info('User registered successfully:', response.data);
            return response.data;
        } catch (error) {
            logger.error('Error registering user:', error);
            throw error.response?.data || { message: 'Registration failed' };
        }
    }

    /**
     * Login user
     * @param {Object} loginData - The login credentials
     * @returns {Promise<Object>} - The logged-in user data or error message
     */
    static async loginUser(loginData) {
        logger.info('Logging in user with data:', loginData);
        try {
            const response = await ApiClient.post("/user/login", loginData);
            logger.info('User logged in successfully:', response.data);
            return response.data;
        } catch (error) {
            logger.error('Error logging in user:', error);
            if (error.response && error.response.data) {
                logger.error('Error details from server:', error.response.data);
                throw new Error(error.response.data.message || 'Login failed. Please try again.');
            } else {
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
        logger.info('Sending password reset email to:', email);
        try {
            const response = await ApiClient.post("/user/forgot-password", { email });
            logger.info('Password reset email sent successfully:', response.data);
            return response.data;
        } catch (error) {
            logger.error('Error sending password reset email:', error);
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
        logger.info('Resetting password with token:', token);
        try {
            const response = await ApiClient.post("/user/reset-password", { token, newPassword });
            logger.info('Password reset successfully:', response.data);
            return response.data;
        } catch (error) {
            logger.error('Error resetting password:', error);
            throw error.response?.data || { message: 'Failed to reset password' };
        }
    }

    /**
     * Fetch user by ID
     * @param {string} userId - The ID of the user
     * @returns {Promise<Object>} - The user data or error message
     */
    static async fetchUserById(userId) {
        logger.info(`Fetching user by ID: ${userId}`);
        try {
            const response = await ApiClient.get(`/user/${userId}`);
            logger.info(`Fetched user by ID: ${userId}`, response.data);
            return response.data;
        } catch (error) {
            logger.error(`Error fetching user by ID: ${userId}`, error);
            throw error.response?.data || { message: 'Failed to fetch user' };
        }
    }

    /**
     * Fetch all users
     * @returns {Promise<Array>} - The list of users or error message
     */
    static async fetchAllUsers() {
        logger.info('Fetching all users');
        try {
            const response = await ApiClient.get("/user");
            logger.info('Fetched all users successfully:', response.data);
            return response.data;
        } catch (error) {
            logger.error('Error fetching all users:', error);
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
        logger.info(`Updating user by ID: ${userId} with data:`, userData);
        try {
            const response = await ApiClient.patch(`/user/${userId}`, userData);
            logger.info(`Updated user by ID: ${userId} successfully:`, response.data);
            return response.data;
        } catch (error) {
            logger.error(`Error updating user by ID: ${userId}`, error);
            throw error.response?.data || { message: 'Failed to update user' };
        }
    }

    /**
     * Delete user by ID
     * @param {string} userId - The ID of the user
     * @returns {Promise<Object>} - The response data or error message
     */
    static async deleteUserById(userId) {
        logger.info(`Deleting user by ID: ${userId}`);
        try {
            const response = await ApiClient.delete(`/user/${userId}`);
            logger.info(`Deleted user by ID: ${userId} successfully:`, response.data);
            return response.data;
        } catch (error) {
            logger.error(`Error deleting user by ID: ${userId}`, error);
            throw error.response?.data || { message: 'Failed to delete user' };
        }
    }

    /**
     * Delete user by email
     * @param {string} email - The email of the user
     * @returns {Promise<Object>} - The response data or error message
     */
    static async deleteUserByEmail(email) {
        logger.info(`Deleting user by email: ${email}`);
        try {
            const response = await ApiClient.delete(`/user/email/${email}`);
            logger.info(`Deleted user by email: ${email} successfully:`, response.data);
            return response.data;
        } catch (error) {
            logger.error(`Error deleting user by email: ${email}`, error);
            throw error.response?.data || { message: 'Failed to delete user' };
        }
    }

    /**
     * Logout user
     * @returns {Promise<Object>} - The response data or error message
     */
    static async logoutUser() {
        logger.info('Logging out user');
        try {
            const response = await ApiClient.post("/user/logout");
            logger.info('User logged out successfully:', response.data);
            return response.data;
        } catch (error) {
            logger.error('Error logging out user:', error);
            throw error.response?.data || { message: 'Failed to logout user' };
        }
    }

    /**
     * Fetch user profile by ID
     * @param {string} userId - The ID of the user
     * @returns {Promise<Object>} - The user profile data or error message
     */
    static async getUserProfile(userId) {
        logger.info(`Fetching user profile by ID: ${userId}`);
        try {
            const response = await ApiClient.get(`/user/${userId}`);
            logger.info(`Fetched user profile by ID: ${userId}`, response.data);
            return response.data;
        } catch (error) {
            logger.error(`Error fetching user profile by ID: ${userId}`, error);
            throw error;
        }
    }

    /**
     * Update user profile by ID
     * @param {string} userId - The ID of the user
     * @param {Object} profileData - The profile data to update
     * @returns {Promise<Object>} - The updated profile data or error message
     */
    static async updateProfile(userId, profileData) {
        logger.info(`Updating profile for user ID: ${userId} with data:`, profileData);
        try {
            const response = await ApiClient.patch(`/user/${userId}`, profileData);
            logger.info(`Updated profile for user ID: ${userId} successfully:`, response.data);
            return response.data;
        } catch (error) {
            logger.error(`Error updating profile for user ID: ${userId}`, error);
            throw error;
        }
    }
}

export default UserService;