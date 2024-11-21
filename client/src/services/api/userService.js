// src/services/api/userService.js

import Cookies from 'universal-cookie';
import logger from '../../utils/logger';
import ApiClient from './ApiClient';

class userService {
    static getAuthHeaders() {
        const cookies = new Cookies();
        const token = cookies.get('BlogdPass');
        return token ? { Authorization: `Bearer ${token}` } : {};
    }

    /**
     * Register a new user
     * @param {Object} userData
     */
    static async registerUser(userData) {
        logger.info('userService: Registering new user');
        try {
            const formData = new FormData();
            Object.keys(userData).forEach((key) => {
                if (userData[key]) {
                    formData.append(key, userData[key]);
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
            logger.info('userService: User registered successfully');
            return response.data;
        } catch (error) {
            logger.error('userService: Error registering user', error);
            throw error.response?.data || new Error('Registration failed');
        }
    }

    /**
     * Login user
     * @param {Object} loginData
     */
    static async loginUser(loginData) {
        logger.info('userService: Logging in user');
        try {
            const response = await ApiClient.post("/auth/login", loginData);
            logger.info('userService: User logged in successfully');
            return response.data; // Expected to return { token, user }
        } catch (error) {
            logger.error('userService: Error logging in user', error);
            throw error.response?.data || new Error('Login failed');
        }
    }

    /**
     * Send password reset email
     * @param {string} email
     */
    static async sendPasswordResetEmail(email) {
        logger.info(`userService: Sending password reset email to ${email}`);
        try {
            const response = await ApiClient.post("/auth/forgot-password", { email });
            logger.info('userService: Password reset email sent');
            return response.data;
        } catch (error) {
            logger.error('userService: Error sending password reset email', error);
            throw error.response?.data || new Error('Failed to send password reset email');
        }
    }

    /**
     * Reset password
     * @param {string} token
     * @param {string} newPassword
     */
    static async resetPassword(token, newPassword) {
        logger.info('userService: Resetting password');
        try {
            const response = await ApiClient.post("/auth/reset-password", { token, newPassword });
            logger.info('userService: Password reset successfully');
            return response.data;
        } catch (error) {
            logger.error('userService: Error resetting password', error);
            throw error.response?.data || new Error('Failed to reset password');
        }
    }

    /**
     * Fetch user by ID
     * @param {string} userId
     */
    static async fetchUserById(userId) {
        try {
            // Validate userId format
            if (!/^[0-9a-fA-F]{24}$/.test(userId)) {
                throw new Error('Invalid userId format');
            }

            const response = await ApiClient.get(`/user/${userId}`, {
                headers: this.getAuthHeaders(),
            });
            logger.info('userService: User fetched successfully');
            return response.data;
        } catch (error) {
            logger.error(`userService: Error fetching user by ID: ${userId}`, error);
            throw error.response?.data || new Error('Failed to fetch user');
        }
    }

    /**
     * Fetch all users
     */
    static async fetchAllUsers() {
        logger.info('userService: Fetching all users');
        try {
            const response = await ApiClient.get("/user", {
                headers: this.getAuthHeaders(),
            });
            logger.info('userService: All users fetched successfully');
            return response.data;
        } catch (error) {
            logger.error('userService: Error fetching all users', error);
            throw error.response?.data || new Error('Failed to fetch users');
        }
    }

    /**
     * Fetch all users except the current user
     * @param {string} userId
     */
    static async fetchUsersExcept(userId) {
        logger.info(`userService: Fetching users excluding user ID: ${userId}`);
        try {
            const response = await ApiClient.get(`/user/list/${userId}`, {
                headers: this.getAuthHeaders(),
            });
            logger.info('userService: Users fetched successfully');
            return response.data;
        } catch (error) {
            logger.error(`userService: Error fetching users excluding user ID: ${userId}`, error);
            throw error.response?.data || new Error('Failed to fetch users');
        }
    }

    /**
     * Update user by ID
     * @param {string} userId
     * @param {Object} userData
     */
    static async updateUserById(userId, userData) {
        logger.info(`userService: Updating user by ID: ${userId}`);
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
            logger.info('userService: User updated successfully');
            return response.data;
        } catch (error) {
            logger.error(`userService: Error updating user by ID: ${userId}`, error);
            throw error.response?.data || new Error('Failed to update user');
        }
    }

    /**
     * Delete user by ID
     * @param {string} userId
     */
    static async deleteUserById(userId) {
        logger.info(`userService: Deleting user by ID: ${userId}`);
        try {
            const response = await ApiClient.delete(`/user/${userId}`, {
                headers: this.getAuthHeaders(),
            });
            logger.info('userService: User deleted successfully');
            return response.data;
        } catch (error) {
            logger.error(`userService: Error deleting user by ID: ${userId}`, error);
            throw error.response?.data || new Error('Failed to delete user');
        }
    }

    /**
     * Delete user by email
     * @param {string} email
     */
    static async deleteUserByEmail(email) {
        logger.info(`userService: Deleting user by email: ${email}`);
        try {
            const response = await ApiClient.delete(`/user/email/${email}`, {
                headers: this.getAuthHeaders(),
            });
            logger.info('userService: User deleted successfully by email');
            return response.data;
        } catch (error) {
            logger.error(`userService: Error deleting user by email: ${email}`, error);
            throw error.response?.data || new Error('Failed to delete user by email');
        }
    }

    /**
     * Logout user
     */
    static async logoutUser() {
        logger.info('userService: Logging out user');
        try {
            const response = await ApiClient.post("/auth/logout", {}, {
                headers: this.getAuthHeaders(),
            });
            logger.info('userService: User logged out successfully');
            return response.data;
        } catch (error) {
            logger.error('userService: Error logging out user', error);
            throw error.response?.data || new Error('Failed to logout');
        }
    }

    /**
     * Get user profile by ID
     * @param {string} userId
     */
    static async getUserProfile(userId) {
        logger.info(`userService: Fetching user profile by ID: ${userId}`);
        try {
            const response = await ApiClient.get(`/user/${userId}`, {
                headers: this.getAuthHeaders(),
            });
            logger.info('userService: User profile fetched successfully');
            return response.data;
        } catch (error) {
            logger.error(`userService: Error fetching user profile by ID: ${userId}`, error);
            throw error.response?.data || new Error('Failed to fetch user profile');
        }
    }

    /**
     * Update user profile by ID
     * @param {string} userId
     * @param {Object} profileData
     */
    static async updateProfile(userId, profileData) {
        logger.info(`userService: Updating profile for user ID: ${userId}`);
        try {
            let headers = this.getAuthHeaders();
            let data = profileData;

            if (profileData.profilePicture || profileData.coverPhoto) {
                data = new FormData();
                Object.keys(profileData).forEach((key) => {
                    if (profileData[key]) {
                        data.append(key, profileData[key]);
                    }
                });
                headers = { ...headers, 'Content-Type': 'multipart/form-data' };
            }

            const response = await ApiClient.patch(`/user/${userId}`, data, { headers });
            logger.info('userService: User profile updated successfully');
            return response.data;
        } catch (error) {
            logger.error(`userService: Error updating profile for user ID: ${userId}`, error);
            throw error.response?.data || new Error('Failed to update profile');
        }
    }

    /**
     * Delete profile picture by user ID
     * @param {string} userId
     */
    static async deleteProfilePicture(userId) {
        logger.info(`userService: Deleting profile picture for user ID: ${userId}`);
        try {
            const response = await ApiClient.delete(`/user/${userId}/profile-picture`, {
                headers: this.getAuthHeaders(),
            });
            logger.info('userService: Profile picture deleted successfully');
            return response.data;
        } catch (error) {
            logger.error(`userService: Error deleting profile picture for user ID: ${userId}`, error);
            throw error.response?.data || new Error('Failed to delete profile picture');
        }
    }
}

export default userService;