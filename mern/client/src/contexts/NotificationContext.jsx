import { createContext, useContext, useState } from 'react';
import CustomToast from '../components/common/CustomToast';
import Logger from '../utils/Logger';

// Create NotificationContext
const NotificationContext = createContext();

// Custom hook to use NotificationContext
export const useNotificationContext = () => useContext(NotificationContext);

// Provider component to wrap the app and provide notification handling
export const NotificationProvider = ({ children }) => {
   // Set default notification state
   const [notification, setNotification] = useState({
      message: '',
      type: 'info', // Default type
      show: false,
      position: { top: '40%', left: '50%' }, // Default position (center)
      delay: 5000, // Default delay
   });

   // Function to dynamically set position
   const setPosition = (type = 'success', isPrivateRoute = true) => {
      let newPosition = { top: '40%', left: '50%' }; // Default to center for public routes or errors

      if (isPrivateRoute) {
         newPosition = type === 'success'
            ? { top: '70px', right: '20px' }  // Top-right for success in private routes
            : { top: '40%', left: '50%' };    // Centered for errors in private routes
      }

      // Only update if position is different
      if (
         notification.position.top !== newPosition.top ||
         notification.position.left !== newPosition.left ||
         notification.position.right !== newPosition.right
      ) {
         setNotification((prev) => ({
            ...prev,
            position: newPosition, // Update to the new position
         }));
         Logger.info(`Toast position set to ${type} on ${isPrivateRoute ? 'private' : 'public'} route`);
      }
   };

   // Function to show notification with dynamic delay based on type
   const showNotification = (message, type = 'success') => {
      Logger.info(`Showing notification: ${message} (${type})`);

      // Set delay based on notification type
      const delay = type === 'success' ? 2000 : 5000;  // 2 seconds for success, 5 seconds for error

      setNotification((prev) => ({
         ...prev,
         message,
         type,
         show: true,
         delay,  // Set the delay dynamically based on the type
      }));
   };

   // Function to hide notification
   const hideNotification = () => {
      Logger.info('Hiding notification');
      setNotification((prev) => ({ ...prev, message: '', show: false }));
   };

   return (
      <NotificationContext.Provider value={{ notification, showNotification, hideNotification, setPosition }}>
         {children}
         {/* Render CustomToast */}
         <CustomToast
            message={notification.message}
            show={notification.show}
            type={notification.type}
            position={notification.position}
            onClose={hideNotification}
            delay={notification.delay}  // Pass the dynamic delay to CustomToast
         />
      </NotificationContext.Provider>
   );
};
