// src/Logger.js

const isLoggingEnabled = process.env.NODE_ENV !== 'production'; // Disable logs in production

const Logger = {
   info: (message, data = null) => {
      if (isLoggingEnabled) {
         console.log(`[INFO] ${message}`, data || '');
      }
   },
   warn: (message, data = null) => {
      if (isLoggingEnabled) {
         console.warn(`[WARN] ${message}`, data || '');
      }
   },
   error: (message, data = null) => {
      if (isLoggingEnabled) {
         console.error(`[ERROR] ${message}`, data || '');
      }
   }
};

export default Logger;
