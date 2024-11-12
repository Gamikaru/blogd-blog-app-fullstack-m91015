// middleware/uploadMiddleware.js

import multer from 'multer';
import path from 'path';

/**
 * Configure multer to store files in memory with specific limits.
 */
const storage = multer.memoryStorage();

const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5 MB file size limit
    },
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|gif|webp/; // Added 'webp'
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

        console.log(`MIME Type: ${file.mimetype}, Extension: ${path.extname(file.originalname).toLowerCase()}`);

        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('Only images are allowed'));
    },
});

export { upload };
