// src/utils/sanitizeContent.js

import DOMPurify from 'dompurify';

/**
 * Sanitizes HTML content to prevent XSS attacks.
 * @param {string} content - The HTML content to sanitize.
 * @returns {string} - The sanitized HTML content.
 */
const sanitizeContent = (content) => {
    if (!content) return '';
    return DOMPurify.sanitize(content, { USE_PROFILES: { html: true } });
};

export default sanitizeContent;
