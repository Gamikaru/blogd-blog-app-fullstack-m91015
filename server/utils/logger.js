// src/utils/logger.js

import fs from 'fs';
import path from 'path';
import { createLogger, format, transports } from 'winston';

// Ensure log directory exists
const logDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}

const logger = createLogger({
    level: process.env.NODE_ENV === 'production' ? 'error' : 'info',
    format: format.combine(
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        format.errors({ stack: true }),
        format.splat(),
        format.json()
    ),
    transports: [
        new transports.Console({
            format: format.combine(
                format.colorize(),
                format.printf(({ timestamp, level, message, ...meta }) => {
                    return `${timestamp} [${level}]: ${message} ${Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ''}`;
                })
            ),
        }),
        new transports.File({ filename: path.join(logDir, 'error.log'), level: 'error' }),
        new transports.File({ filename: path.join(logDir, 'combined.log') }),
    ],
    exceptionHandlers: [
        new transports.File({ filename: path.join(logDir, 'exceptions.log') }),
    ],
    rejectionHandlers: [
        new transports.File({ filename: path.join(logDir, 'rejections.log') }),
    ],
});

export default logger;