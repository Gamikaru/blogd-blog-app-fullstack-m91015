import multer from 'multer';

// Configure multer to store files in memory
const storage = multer.memoryStorage();

// Set up multer with file size limit and file count limit
const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5 MB file size limit
        files: 5 // Limit to 5 files per request
    }
});

export default upload;