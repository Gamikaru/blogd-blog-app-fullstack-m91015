import { createContext, useContext, useState } from 'react';
import CustomToast from '../components/common/CustomToast';
import Logger from '../utils/Logger';

// Create NotificationContext
const NotificationContext = createContext();

// Custom hook to use NotificationContext
export const useNotificationContext = () => useContext(NotificationContext);

// Provider component to wrap the app and provide notification handling
export const NotificationProvider = ({ children }) => {
   const [notification, setNotification] = useState({ message: '', type: '', show: false, position: {} });

   // Function to show notification
   const showNotification = (message, type = 'success', position = { top: '40%', left: '50%' }) => {
      Logger.info(`Showing notification: ${message} (${type})`);
      setNotification({ message, type, show: true, position });
   };

   // Function to hide notification
   const hideNotification = () => {
      Logger.info('Hiding notification');
      setNotification({ message: '', type: '', show: false, position: {} });
   };

   return (
      <NotificationContext.Provider value={{ notification, showNotification, hideNotification }}>
         {children}
         {/* Render CustomToast */}
         <CustomToast
            message={notification.message}
            show={notification.show}
            type={notification.type}
            position={notification.position}
            onClose={hideNotification}
         />
      </NotificationContext.Provider>
   );
};
