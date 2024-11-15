// src/middleware/uploadMiddleware.js

import multer from 'multer';
import path from 'path';
import logger from '../utils/logger.js';

/**
 * Configuration for allowed file types and size.
 */
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
const ALLOWED_EXTENSIONS = /\.(jpeg|jpg|png|gif|webp)$/i;
const MAX_FILE_SIZE = process.env.MAX_FILE_SIZE ? parseInt(process.env.MAX_FILE_SIZE) : 5 * 1024 * 1024; // Default 5 MB

const storage = multer.memoryStorage();

/**
 * File filter to validate uploaded files.
 */
const fileFilter = (req, file, cb) => {
    const { mimetype, originalname } = file;
    const extension = path.extname(originalname).toLowerCase();

    logger.info('Processing file upload:', {
        filename: originalname,
        mimetype,
        extension
    });

    if (ALLOWED_MIME_TYPES.includes(mimetype) && ALLOWED_EXTENSIONS.test(extension)) {
        logger.info('File validation passed for', originalname);
        return cb(null, true);
    }

    logger.error('Invalid file type', {
        filename: originalname,
        mimetype,
        extension,
        allowedMimeTypes: ALLOWED_MIME_TYPES.join(', '),
        allowedExtensions: ALLOWED_EXTENSIONS.toString()
    });

    const error = new multer.MulterError('LIMIT_UNEXPECTED_FILE', originalname);
    error.message = 'Only images (JPEG, JPG, PNG, GIF, WEBP) are allowed';
    cb(error);
};

const upload = multer({
    storage,
    limits: {
        fileSize: MAX_FILE_SIZE,
    },
    fileFilter,
});

export { upload };
