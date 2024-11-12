// src/contexts/UserContext.jsx

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import Cookies from 'universal-cookie';
import UserService from '../services/api/UserService';
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
    return context.setUser;
};

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);

    const fetchUserData = async (userId, token) => {
        try {
            const fetchedUser = await UserService.fetchUserById(userId);
            // Map Mongoose _id to userId if userId doesn't exist
            const userWithId = {
                ...fetchedUser,
                userId: fetchedUser.userId || fetchedUser._id,
            };
            setUser(userWithId);
            logger.info('UserContext: User data fetched successfully');
        } catch (error) {
            logger.error('UserContext: Error fetching user data', error);
            setUser(null);
            // Optionally handle token invalidation here
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const initializeUser = async () => {
            const cookies = new Cookies();
            const token = cookies.get('BlogdPass');
            const userId = cookies.get('userID');

            if (!token || !userId) {
                setLoading(false);
                return;
            }

            await fetchUserData(userId, token);
        };

        initializeUser();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            if (!user) {
                setError("User not authenticated");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                // Use userId or fallback to _id
                const currentUserId = user.userId || user._id;
                const usersData = await UserService.fetchUsersExcept(currentUserId);
                setUsers(usersData);
            } catch (error) {
                setError("Failed to fetch users");
                console.error('Fetch Error:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user]);

    const login = async (loginData) => {
        try {
            const response = await UserService.loginUser(loginData);
            const { token, user: userData } = response;
            const cookies = new Cookies();
            cookies.set('BlogdPass', token, { path: '/' });
            cookies.set('userID', userData.userId || userData._id, { path: '/' });
            setUser(userData);
            logger.info('UserContext: User logged in successfully');
            return { success: true };
        } catch (error) {
            logger.error('UserContext: Login failed', error);
            return { success: false, message: error.message };
        }
    };

    const logout = async () => {
        try {
            await UserService.logoutUser();
            const cookies = new Cookies();
            cookies.remove('BlogdPass', { path: '/' });
            cookies.remove('userID', { path: '/' });
            setUser(null);
            logger.info('UserContext: User logged out successfully');
        } catch (error) {
            logger.error('UserContext: Logout failed', error);
        }
    };

    const register = async (userData) => {
        try {
            const response = await UserService.registerUser(userData);
            logger.info('UserContext: User registered successfully', response);
            return { success: true, data: response };
        } catch (error) {
            logger.error('UserContext: Registration failed', error);
            return { success: false, message: error.message };
        }
    };

    const updateUser = async (userId, updatedData) => {
        try {
            const updatedUser = await UserService.updateUserById(userId, updatedData);
            // Map _id to userId if necessary
            const userWithId = {
                ...updatedUser,
                userId: updatedUser.userId || updatedUser._id,
            };
            setUser(userWithId);
            logger.info('UserContext: User updated successfully');
            return { success: true };
        } catch (error) {
            logger.error('UserContext: Update user failed', error);
            return { success: false, message: error.message };
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