/**
 * Helper function to handle errors
 */
export const sendError = (res, error, message, statusCode = 500) => {
    logger.error(`${message}:`, error);
    res.status(statusCode).json({
        error: true,
        message,
        details: error.message || error,
    });
};
