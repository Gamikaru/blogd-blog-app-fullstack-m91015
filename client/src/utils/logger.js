// src/utils/logger.js

const isLoggingEnabled = process.env.NODE_ENV !== 'production'; // Disable logs in production

const logger = {
    info: (message, data = null) => {
        if (isLoggingEnabled) {
            console.info(`[INFO] ${message}`, data || '');
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
    },

    debug: (message, data = null) => {
        if (isLoggingEnabled) {
            console.debug(`[DEBUG] ${message}`, data || '');
        }
    },
    trace: (message, data = null) => {
        if (isLoggingEnabled) {
            console.trace(`[TRACE] ${message}`, data || '');
        }
    }

};

export default logger;
