// migrateBase64Images.js

import dotenv from 'dotenv';
dotenv.config(); // Load environment variables first

import mongoose from 'mongoose';
import { uploadToCloudinary } from '../config/cloudinaryConfig.js'; // Import the function
import Post from '../models/postSchema.js'; // Adjust the path if necessary

/**
 * Process and migrate images from base64 to Cloudinary.
 */
const migrateImages = async () => {
    try {
        const posts = await Post.find({ 'images.0': { $exists: true } });

        for (const post of posts) {
            const uploadedImageUrls = [];

            for (const image of post.images) {
                if (image.isLink || !image.data) continue;

                try {
                    const buffer = Buffer.from(image.data, 'base64');
                    const imageUrl = await uploadToCloudinary(buffer, 'post_image'); // Use buffer directly
                    uploadedImageUrls.push(imageUrl);
                } catch (err) {
                    console.error(`Error processing image for post ${post._id}:`, err);
                }
            }

            // Update the post with new image URLs
            if (uploadedImageUrls.length > 0) {
                post.imageUrls = post.imageUrls.concat(uploadedImageUrls);
                post.images = post.images.filter(image => image.isLink || !image.data); // Remove migrated images

                await post.save();
                console.log(`Migrated images for post: ${post._id}`);
            }
        }

        console.log('Image migration completed successfully.');
    } catch (error) {
        console.error('Error during image migration:', error);
    } finally {
        mongoose.connection.close();
    }
};

// Connect to MongoDB before running migrations
mongoose.connect(process.env.ATLAS_URI)
    .then(() => {
        console.log('Connected to MongoDB. Starting migration...');
        migrateImages();
    })
    .catch(err => {
        console.error('MongoDB connection error:', err);
    });