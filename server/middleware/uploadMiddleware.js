// middleware/uploadMiddleware.js

import multer from 'multer';

/**
 * Configure multer to store files in memory with specific limits.
 */
const storage = multer.memoryStorage();

const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5 MB file size limit
        files: 5, // Limit to 5 files per request
    },
    fileFilter: (req, file, cb) => {
        // Accept images only
        if (!file.mimetype.startsWith('image/')) {
            return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
    },
});

export default upload;