// middleware/uploadMiddleware.js

import multer from 'multer';
import path from 'path';
import logger from '../utils/logger.js';

const storage = multer.memoryStorage();

const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5 MB file size limit
    },
    fileFilter: (req, file, cb) => {
        // Only check MIME type for webp files
        if (file.mimetype === 'image/webp') {
            logger.info('WebP file detected, allowing upload', {
                filename: file.originalname,
                mimetype: file.mimetype
            });
            return cb(null, true);
        }

        // For other formats, check both MIME type and extension
        const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
        const allowedExtensions = /\.(jpeg|jpg|png|gif)$/i;

        const extension = path.extname(file.originalname).toLowerCase();

        logger.info('Processing file upload:', {
            filename: file.originalname,
            mimetype: file.mimetype,
            extension: extension
        });

        if (allowedMimeTypes.includes(file.mimetype) && allowedExtensions.test(extension)) {
            logger.info('File validation passed');
            return cb(null, true);
        }

        // Log detailed error information
        logger.error('Invalid file type', {
            filename: file.originalname,
            mimetype: file.mimetype,
            extension: extension,
            allowedMimeTypes: allowedMimeTypes.join(', '),
            allowedExtensions: allowedExtensions.toString()
        });

        cb(new Error('Only images (JPEG, JPG, PNG, GIF, WEBP) are allowed'));
    }
});

export { upload };
