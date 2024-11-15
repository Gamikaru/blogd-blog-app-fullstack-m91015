// src/services/api/UserService.js

import { logger } from '@utils/';
import Cookies from 'universal-cookie'; // Add this line
import ApiClient from './ApiClient';


class UserService {
    static getAuthHeaders() {
        const cookies = new Cookies();
        const token = cookies.get('BlogdPass');
        return token ? { Authorization: `Bearer ${token}` } : {};
    }

    /**
     * Update user status by user ID
     * @param {string} userId
     * @param. {string} status
     */
    static async updateUserStatus(userId, status) {
        logger.info(`UserService: Updating status for user ID: ${userId}`);
        try {
            const response = await ApiClient.put(
                `/user/${userId}/status`,
                { status },
                { headers: this.getAuthHeaders() }
            );
            logger.info(`UserService: Status updated for user ID: ${userId}`);
            return response.data;
        } catch (error) {
            logger.error(`UserService: Error updating status for user ID: ${userId}`, error);
            throw error.response?.data || new Error('Failed to update status');
        }
    }

    /**
     * Register a new user
     * @param {Object} userData
     */
    static async registerUser(userData) {
        logger.info('UserService: Registering new user');
        try {
            const formData = new FormData();
            Object.keys(userData).forEach((key) => {
                if (userData[key]) {
                    formData.append(key,
                        userData[key]);
                }
            });
            if (userData.profilePicture) {
                formData.append('profilePicture', userData.profilePicture);
            }

            if (userData.coverPhoto) {
                formData.append('coverPhoto', userData.coverPhoto);
            }

            const response = await ApiClient.post("/auth/register", formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            logger.info('UserService: User registered successfully');
            return response.data;
        } catch (error) {
            logger.error('UserService: Error registering user', error);
            throw error.response?.data || new Error('Registration failed');
        }
    }

    /**
     * Login user
     * @param {Object} loginData
     */
    static async loginUser(loginData) {
        logger.info('UserService: Logging in user');
        try {
            const response = await ApiClient.post("/auth/login", loginData);
            logger.info('UserService: User logged in successfully');
            return response.data; // Expected to return { token, user }
        } catch (error) {
            logger.error('UserService: Error logging in user', error);
            throw error.response?.data || new Error('Login failed');
        }
    }

    /**
     * Send password reset email
     * @param {string} email
     */
    static async sendPasswordResetEmail(email) {
        logger.info(`UserService: Sending password reset email to ${email}`);
        try {
            const response = await ApiClient.post("/auth/forgot-password", { email });
            logger.info('UserService: Password reset email sent');
            return response.data;
        } catch (error) {
            logger.error('UserService: Error sending password reset email', error);
            throw error.response?.data || new Error('Failed to send password reset email');
        }
    }

    /**
     * Reset password
     * @param {string} token
     * @param {string} newPassword
     */
    static async resetPassword(token, newPassword) {
        logger.info('UserService: Resetting password');
        try {
            const response = await ApiClient.post("/auth/reset-password", { token, newPassword });
            logger.info('UserService: Password reset successfully');
            return response.data;
        } catch (error) {
            logger.error('UserService: Error resetting password', error);
            throw error.response?.data || new Error('Failed to reset password');
        }
    }

    /**
     * Fetch user by ID
     * @param {string} userId
     */
    static async fetchUserById(userId) {
        logger.info(`UserService: Fetching user by ID: ${userId}`);
        try {
            const response = await ApiClient.get(`/user/${userId}`, {
                headers: this.getAuthHeaders(),
            });
            logger.info('UserService: User fetched successfully');
            return response.data;
        } catch (error) {
            logger.error(`UserService: Error fetching user by ID: ${userId}`, error);
            throw error.response?.data || new Error('Failed to fetch user');
        }
    }

    /**
     * Fetch all users
     */
    static async fetchAllUsers() {
        logger.info('UserService: Fetching all users');
        try {
            const response = await ApiClient.get("/user", {
                headers: this.getAuthHeaders(),
            });
            logger.info('UserService: All users fetched successfully');
            return response.data;
        } catch (error) {
            logger.error('UserService: Error fetching all users', error);
            throw error.response?.data || new Error('Failed to fetch users');
        }
    }

    /**
     * Fetch all users except the current user
     * @param {string} userId
     */
    static async fetchUsersExcept(userId) {
        logger.info(`UserService: Fetching users excluding user ID: ${userId}`);
        try {
            const response = await ApiClient.get(`/user/list/${userId}`, { // Added '/user' prefix
                headers: this.getAuthHeaders(),
            });
            logger.info('UserService: Users fetched successfully');
            return response.data;
        } catch (error) {
            logger.error(`UserService: Error fetching users excluding user ID: ${userId}`, error);
            throw error.response?.data || new Error('Failed to fetch users');
        }
    }

    /**
     * Update user by ID
     * @param {string} userId
     * @param {Object} userData
     */
    static async updateUserById(userId, userData) {
        logger.info(`UserService: Updating user by ID: ${userId}`);
        try {
            let headers = this.getAuthHeaders();
            let data = userData;

            if (userData.profilePicture || userData.coverPhoto) {
                data = new FormData();
                Object.keys(userData).forEach((key) => {
                    if (userData[key]) {
                        data.append(key, userData[key]);
                    }
                });
                headers = { ...headers, 'Content-Type': 'multipart/form-data' };
            }

            const response = await ApiClient.patch(`/user/${userId}`, data, { headers });
            logger.info('UserService: User updated successfully');
            return response.data;
        } catch (error) {
            logger.error(`UserService: Error updating user by ID: ${userId}`, error);
            throw error.response?.data || new Error('Failed to update user');
        }
    }

    /**
     * Delete user by ID
     * @param {string} userId
     */
    static async deleteUserById(userId) {
        logger.info(`UserService: Deleting user by ID: ${userId}`);
        try {
            const response = await ApiClient.delete(`/user/${userId}`, {
                headers: this.getAuthHeaders(),
            });
            logger.info('UserService: User deleted successfully');
            return response.data;
        } catch (error) {
            logger.error(`UserService: Error deleting user by ID: ${userId}`, error);
            throw error.response?.data || new Error('Failed to delete user');
        }
    }

    /**
     * Delete user by email
     * @param {string} email
     */
    static async deleteUserByEmail(email) {
        logger.info(`UserService: Deleting user by email: ${email}`);
        try {
            const response = await ApiClient.delete(`/user/email/${email}`, {
                headers: this.getAuthHeaders(),
            });
            logger.info('UserService: User deleted successfully by email');
            return response.data;
        } catch (error) {
            logger.error(`UserService: Error deleting user by email: ${email}`, error);
            throw error.response?.data || new Error('Failed to delete user by email');
        }
    }

    /**
     * Logout user
     */
    static async logoutUser() {
        logger.info('UserService: Logging out user');
        try {
            const response = await ApiClient.post("/auth/logout", {}, {
                headers: this.getAuthHeaders(),
            });
            logger.info('UserService: User logged out successfully');
            return response.data;
        } catch (error) {
            logger.error('UserService: Error logging out user', error);
            throw error.response?.data || new Error('Failed to logout');
        }
    }

    /**
     * Get user profile by ID
     * @param {string} userId
     */
    static async getUserProfile(userId) {
        logger.info(`UserService: Fetching user profile by ID: ${userId}`);
        try {
            const response = await ApiClient.get(`/user/${userId}`, {
                headers: this.getAuthHeaders(),
            });
            logger.info('UserService: User profile fetched successfully');
            return response.data;
        } catch (error) {
            logger.error(`UserService: Error fetching user profile by ID: ${userId}`, error);
            throw error.response?.data || new Error('Failed to fetch user profile');
        }
    }

    /**
     * Update user profile by ID
     * @param {string} userId
     * @param {Object} profileData
     */
    static async updateProfile(userId, profileData) {
        logger.info(`UserService: Updating profile for user ID: ${userId}`);
        try {
            let headers = this.getAuthHeaders();
            let data = profileData;

            // Check if profilePicture is included
            if (profileData.profilePicture) {
                data = new FormData();
                Object.keys(profileData).forEach((key) => {
                    if (profileData[key]) {
                        data.append(key, profileData[key]);
                    }
                });
                headers = { ...headers, 'Content-Type': 'multipart/form-data' };
            }

            const response = await ApiClient.patch(`/user/${userId}`, data, { headers });
            logger.info('UserService: User profile updated successfully');
            return response.data;
        } catch (error) {
            logger.error(`UserService: Error updating profile for user ID: ${userId}`, error);
            throw error.response?.data || new Error('Failed to update profile');
        }
    }
}

export default UserService;