// src/contexts/NotificationContext.jsx

import { CustomToast } from '@components';
import { logger } from '@utils';
import PropTypes from 'prop-types'; // Import PropTypes
import { createContext, useCallback, useContext, useMemo, useState } from 'react';

export const NotificationContext = createContext();

export const useNotificationContext = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotificationContext must be used within a NotificationProvider');
    }
    return context;
};

export const NotificationProvider = ({ children }) => {
    const [notification, setNotification] = useState({
        message: '',
        type: 'info',
        show: false,
        position: { top: '40%', left: '50%' },
        delay: 5000,
        onConfirm: null,
        onCancel: null,
    });

    const setPosition = useCallback((type = 'success', isPrivateRoute = true) => {
        let newPosition = { top: '40%', left: '50%' };

        if (isPrivateRoute) {
            newPosition =
                type === 'success'
                    ? { top: '70px', right: '20px' }
                    : { top: '40%', left: '50%' };
        }

        setNotification((prev) => ({
            ...prev,
            position: newPosition,
        }));

        logger.info(
            `Toast position set to ${type} on ${isPrivateRoute ? 'private' : 'public'} route`
        );
    }, []);

    const showNotification = useCallback(
        (
            message,
            type = 'success',
            _autoClose = true, // Prefixed with underscore
            onConfirm = null,
            onCancel = null
        ) => {
            logger.info(`Showing notification: ${message} (${type})`);
            const delay = type === 'success' ? 2000 : 5000;

            setNotification((prev) => ({
                ...prev,
                message,
                type,
                show: true,
                delay,
                onConfirm,
                onCancel,
            }));
        },
        []
    );

    const hideNotification = useCallback(() => {
        logger.info('Hiding notification');
        setNotification((prev) => ({ ...prev, message: '', show: false }));
    }, []);

    const contextValue = useMemo(
        () => ({
            notification,
            showNotification,
            hideNotification,
            setPosition,
        }),
        [notification, showNotification, hideNotification, setPosition]
    );

    return (
        <NotificationContext.Provider value={contextValue}>
            {children}
            <CustomToast
                message={notification.message}
                show={notification.show}
                type={notification.type}
                position={notification.position}
                onClose={hideNotification}
                delay={notification.delay}
                onConfirm={notification.onConfirm}
                onCancel={notification.onCancel}
            />
        </NotificationContext.Provider>
    );
};

NotificationProvider.propTypes = {
    children: PropTypes.node.isRequired,
};