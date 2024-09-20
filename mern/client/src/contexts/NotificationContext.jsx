// src/NotificationContext.js

import { createContext, useContext, useState } from 'react';

// Create NotificationContext
const NotificationContext = createContext();

// Custom hook to use NotificationContext
export const useNotificationContext = () => useContext(NotificationContext);

// Provider component to wrap the app and provide notification handling
export const NotificationProvider = ({ children }) => {
   const [notification, setNotification] = useState({ message: '', type: '', show: false });

   // Function to show notification
   const showNotification = (message, type = 'success') => {
      setNotification({ message, type, show: true });
   };

   // Function to hide notification
   const hideNotification = () => {
      setNotification({ message: '', type: '', show: false });
   };

   return (
      <NotificationContext.Provider value={{ notification, showNotification, hideNotification }}>
         {children}
         {notification.show && (
            <div className={`toast-container ${notification.type}`}>
               <div className="toast-message">{notification.message}</div>
               <button onClick={hideNotification}>Close</button>
            </div>
         )}
      </NotificationContext.Provider>
   );
};
