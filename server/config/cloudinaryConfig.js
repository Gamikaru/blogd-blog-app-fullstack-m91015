// config/cloudinaryConfig.js

import dotenv from 'dotenv';
dotenv.config();

import { v2 as cloudinary } from 'cloudinary';

/**
 * Configure Cloudinary with your credentials.
 */
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Helper function to upload a single image to Cloudinary.
 * @param {Buffer} buffer - The image buffer.
 * @param {String} filename - The original filename.
 * @param {String} folderName - The destination folder in Cloudinary.
 * @returns {Promise<String>} - The secure URL of the uploaded image.
 */
const uploadToCloudinary = (buffer, filename, folderName) => {
    return new Promise((resolve, reject) => {
        const uniquePublicId = `${filename.split('.')[0]}_${Date.now()}`;
        const stream = cloudinary.uploader.upload_stream(
            {
                folder: folderName,
                public_id: uniquePublicId,
                overwrite: true,
                resource_type: 'image',
            },
            (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result.secure_url);
                }
            }
        );
        stream.end(buffer);
    });
};

export { uploadToCloudinary };
export default cloudinary;