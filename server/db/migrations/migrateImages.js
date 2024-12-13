// // migrateImages.js

// import dotenv from 'dotenv';
// dotenv.config(); // Load environment variables

// import mongoose from 'mongoose';
// import sharp from 'sharp';
// import '../db/connection.js'; // Ensure the connection is established
// import Post from '../models/post.js'; // Adjust the path as needed

// const processImage = async (imageData) => {
//     try {
//         const buffer = Buffer.from(imageData, 'base64');
//         const processedBuffer = await sharp(buffer)
//             .resize({ width: 1200 }) // Resize to a max width of 1200px
//             .jpeg({ quality: 80 }) // Convert to JPEG with 80% quality
//             .toBuffer();
//         return processedBuffer.toString('base64');
//     } catch (error) {
//         console.error('Error processing image data:', error);
//         throw error;
//     }
// };

// const migrateImages = async () => {
//     try {
//         const posts = await Post.find({
//             images: {
//                 $elemMatch: {
//                     data: {
//                         $exists: true,
//                         $type: 'string',
//                         $ne: '',
//                     },
//                 },
//             },
//         });

//         for (const post of posts) {
//             const processedImages = await Promise.all(
//                 post.images.map(async (image) => {
//                     if (
//                         image.isLink ||
//                         !image.data ||
//                         typeof image.data !== 'string' ||
//                         image.data.trim() === ''
//                     ) {
//                         return image; // Skip linked images and invalid data
//                     }
//                     try {
//                         const processedData = await processImage(image.data);
//                         return {
//                             ...image,
//                             data: processedData,
//                         };
//                     } catch (err) {
//                         console.error(`Error processing image for post ${post._id}:`, err);
//                         return image; // Keep the original image data if processing fails
//                     }
//                 })
//             );

//             post.images = processedImages;
//             await post.save();
//             console.log(`Processed images for post: ${post._id}`);
//         }

//         console.log('Image migration completed successfully.');
//     } catch (error) {
//         console.error('Error during image migration:', error);
//     } finally {
//         mongoose.connection.close();
//     }
// };

// migrateImages();