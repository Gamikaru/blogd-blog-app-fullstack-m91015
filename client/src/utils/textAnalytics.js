// src/utils/textAnalytics.js

/**
 * Calculate estimated reading time in minutes
 * @param {string} content - HTML or text content
 * @param {number} wordsPerMinute - Reading speed (default 225)
 * @returns {number} Reading time in minutes
 */
export const calculateReadingTime = (content, wordsPerMinute = 225) => {
    if (!content) return 0;

    // Strip HTML tags if present
    const plainText = content.replace(/<[^>]*>/g, '');
    const wordCount = countWords(plainText);

    // Calculate reading time and round up to nearest minute
    return Math.ceil(wordCount / wordsPerMinute);
};

/**
 * Count words in text
 * @param {string} content - Text content
 * @returns {number} Word count
 */
export const countWords = (content) => {
    if (!content) return 0;

    // Strip HTML tags if present
    const plainText = content.replace(/<[^>]*>/g, '');

    // Split by whitespace and filter empty strings
    return plainText
        .trim()
        .split(/\s+/)
        .filter(word => word.length > 0)
        .length;
};