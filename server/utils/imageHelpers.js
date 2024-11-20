// utils/imageHelpers.js

/**
 * Extracts the publicId from a Cloudinary URL.
 * Assumes URL format: https://res.cloudinary.com/<cloud_name>/image/upload/<folder>/<publicId>.<extension>
 * Adjust the regex if your URL structure differs.
 *
 * @param {String} url - The full Cloudinary URL.
 * @returns {String} - The extracted publicId.
 * @throws Will throw an error if the URL format is invalid.
 */
export const extractPublicIdFromURL = (url) => {
    try {
        const urlObj = new URL(url);
        const pathname = urlObj.pathname; // e.g., /<folder>/<publicId>.<extension>
        const segments = pathname.split('/');
        const filename = segments.pop(); // <publicId>.<extension>
        const publicIdWithFolder = segments.join('/'); // <folder>

        const publicId = filename.substring(0, filename.lastIndexOf('.')); // Remove extension
        return `${publicIdWithFolder}/${publicId}`;
    } catch (error) {
        throw new Error(`Invalid Cloudinary URL: ${url}`);
    }
};