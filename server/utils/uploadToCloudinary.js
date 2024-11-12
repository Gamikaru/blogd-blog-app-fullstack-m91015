// /**
//  * Helper function to upload a single image to Cloudinary.
//  * @param {Buffer} buffer - The image buffer.
//  * @param {String} filename - The original filename.
//  * @returns {Promise<String>} - The secure URL of the uploaded image.
//  */
// const uploadToCloudinary = (buffer, filename) => {
//     return new Promise((resolve, reject) => {
//         const stream = cloudinary.uploader.upload_stream(
//             {
//                 folder: 'blog_images',
//                 public_id: filename.split('.')[0], // Use filename without extension as public_id
//                 overwrite: true, // Overwrite if public_id already exists
//                 resource_type: 'image',
//             },
//             (error, result) => {
//                 if (error) {
//                     reject(error);
//                 } else {
//                     resolve(result.secure_url);
//                 }
//             }
//         );
//         stream.end(buffer);
//     });
// };

// export { uploadToCloudinary };
