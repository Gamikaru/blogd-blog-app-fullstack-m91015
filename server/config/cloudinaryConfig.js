// config/cloudinaryConfig.js

import dotenv from 'dotenv';
dotenv.config(); // Load environment variables first

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
 * @returns {Promise<String>} - The secure URL of the uploaded image.
 */
const uploadToCloudinary = (buffer, filename) => {
    return new Promise((resolve, reject) => {
        const uniquePublicId = `${filename.split('.')[0]}_${Date.now()}`; // Append timestamp to ensure uniqueness
        const stream = cloudinary.uploader.upload_stream(
            {
                folder: 'blog_images',
                public_id: uniquePublicId, // Use unique public_id
                overwrite: true, // Overwrite if public_id already exists
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