import { CustomToast, Logger } from '@components';
import { createContext, useContext, useState } from 'react';

const NotificationContext = createContext();

const useNotificationContext = () => useContext(NotificationContext);

const NotificationProvider = ({ children }) => {
    const [notification, setNotification] = useState({
        message: '',
        type: 'info',
        show: false,
        position: { top: '40%', left: '50%' },
        delay: 5000,
    });

    const setPosition = (type = 'success', isPrivateRoute = true) => {
        let newPosition = { top: '40%', left: '50%' };

        if (isPrivateRoute) {
            newPosition = type === 'success'
                ? { top: '70px', right: '20px' }
                : { top: '40%', left: '50%' };
        }

        if (!notification.position) {
            notification.position = {};
        }

        if (
            notification.position.top !== newPosition.top ||
            notification.position.left !== newPosition.left ||
            notification.position.right !== newPosition.right
        ) {
            setNotification((prev) => ({
                ...prev,
                position: newPosition,
            }));
            Logger.info(`Toast position set to ${type} on ${isPrivateRoute ? 'private' : 'public'} route`);
        }
    };

    const showNotification = (message, type = 'success', autoClose = true, onConfirm = null, onCancel = null) => {
        Logger.info(`Showing notification: ${message} (${type})`);
        const delay = type === 'success' ? 2000 : 5000;

        setNotification((prev) => ({
            ...prev,
            message,
            type,
            show: true,
            delay,
            onConfirm,
            onCancel
        }));
    };

    const hideNotification = () => {
        Logger.info('Hiding notification');
        setNotification((prev) => ({ ...prev, message: '', show: false }));
    };

    return (
        <NotificationContext.Provider value={{ notification, showNotification, hideNotification, setPosition }}>
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

export default NotificationProvider;
export { useNotificationContext };
