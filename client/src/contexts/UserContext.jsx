// src/contexts/UserContext.jsx

import { userService } from '@services/api';
import PropTypes from 'prop-types';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import Cookies from 'universal-cookie';
import logger from '../utils/logger';

export const UserContext = createContext();

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return { user: context.user, loading: context.loading };
};

export const useUserUpdate = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUserUpdate must be used within a UserProvider');
    }
    return {
        login: context.login,
        logout: context.logout,
        register: context.register,
        updateUser: context.updateUser,
        setUser: context.setUser,
    };
};

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);

    const fetchUserData = async (userId) => {
        try {
            // Ensure userId is a string
            const validUserId = String(userId);
            logger.info(`UserContext: Fetching user data for userId: ${validUserId}`);

            const fetchedUser = await userService.fetchUserById(validUserId);
            const userWithId = {
                ...fetchedUser,
                userId: fetchedUser.userId || fetchedUser._id,
            };
            setUser(userWithId);
            logger.info('UserContext: User data fetched successfully');
        } catch (error) {
            logger.error('UserContext: Error fetching user data', error);
            setUser(null);
            setError(error.message);
        }
    };

    useEffect(() => {
        const initializeUser = async () => {
            const cookies = new Cookies();
            const token = cookies.get('BlogdPass');
            let userId = cookies.get('userId');

            logger.info(`UserContext: Retrieved token: ${token}`);
            logger.info(`UserContext: Retrieved userId: ${userId}`);

            if (!token || !userId) {
                setLoading(false);
                return;
            }

            // Validate userId type
            if (typeof userId !== 'string') {
                logger.error('UserContext: userId from cookies is not a string', userId);
                setError('Invalid userId format in cookies');
                setUser(null);
                setLoading(false);
                return;
            }

            // Optional: Further validate userId format
            const isValidFormat = /^[a-fA-F0-9]{24}$/.test(userId);
            if (!isValidFormat) {
                logger.error('UserContext: userId does not match expected format', userId);
                setError('Invalid userId format');
                setUser(null);
                setLoading(false);
                return;
            }

            await fetchUserData(userId);
            setLoading(false);
        };

        initializeUser();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            if (!user) {
                setError("User not authenticated");
                return;
            }

            try {
                setLoading(true);
                const currentUserId = String(user.userId || user._id);
                const isValidFormat = /^[a-fA-F0-9]{24}$/.test(currentUserId);
                if (!isValidFormat) {
                    throw new Error('Invalid currentUserId format');
                }

                const usersData = await userService.fetchUsersExcept(currentUserId);
                setUsers(usersData);
                logger.info('UserContext: Fetched users excluding current user');
            } catch (error) {
                logger.error('UserContext: FetchData error', error);
                setError("Failed to fetch users");
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchData();
        }
    }, [user]);

    const login = async (loginData) => {
        try {
            const response = await userService.loginUser(loginData);
            const { token, user: userData } = response;
            const cookies = new Cookies();
            cookies.set('BlogdPass', token, { path: '/' });

            // Ensure userId is a string
            const userId = String(userData.userId || userData._id);
            cookies.set('userId', userId, { path: '/' });

            setUser({
                ...userData,
                userId,
            });
            logger.info('UserContext: User logged in successfully');
            return { success: true };
        } catch (error) {
            logger.error('UserContext: Login failed', error);
            return { success: false, message: error.message };
        }
    };

    const logout = async () => {
        try {
            await userService.logoutUser();
            const cookies = new Cookies();
            cookies.remove('BlogdPass', { path: '/' });
            cookies.remove('userId', { path: '/' });
            setUser(null);
            logger.info('UserContext: User logged out successfully');
        } catch (error) {
            logger.error('UserContext: Logout failed', error);
        }
    };

    const register = async (userData) => {
        try {
            const response = await userService.registerUser(userData);
            logger.info('UserContext: User registered successfully', response);
            return { success: true, data: response };
        } catch (error) {
            logger.error('UserContext: Registration failed', error);
            return { success: false, message: error.message };
        }
    };

    const updateUser = async (userId, updatedData) => {
        try {
            const validUserId = String(userId);
            const updatedUser = await userService.updateUserById(validUserId, updatedData);
            setUser({
                ...updatedUser,
                userId: String(updatedUser.userId || updatedUser._id),
            });
            logger.info('UserContext: User updated successfully');
            return { success: true };
        } catch (error) {
            logger.error('UserContext: Error updating user', error);
            throw error;
        }
    };

    const contextValue = useMemo(
        () => ({
            user,
            loading,
            login,
            logout,
            register,
            updateUser,
            setUser,
            users,
            error,
        }),
        [user, loading, users, error]
    );

    return <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>;
};

UserProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
