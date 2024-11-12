// utils/sanitizeContent.js

import sanitizeHtml from 'sanitize-html';

/**
 * Sanitizes HTML content on the back-end.
 * @param {string} content - The HTML content to sanitize.
 * @returns {string} - The sanitized HTML content.
 */
export const sanitizeContent = (content) => {
    return sanitizeHtml(content, {
        allowedTags: [
            ...sanitizeHtml.defaults.allowedTags,
            'img',
            'h1',
            'h2',
            'h3',
            'h4',
            'h5',
            'h6',
            'blockquote',
            'pre',
            'code',
            'ul',
            'ol',
            'nl',
            'li',
            'table',
            'thead',
            'caption',
            'tbody',
            'tr',
            'th',
            'td',
            'strong',
            'em',
            'p',
            'br',
            'div',
            'span',
        ],
        allowedAttributes: {
            ...sanitizeHtml.defaults.allowedAttributes,
            img: ['src', 'alt', 'title', 'width', 'height'],
            a: ['href', 'name', 'target'],
            '*': ['style'],
        },
        allowedStyles: {
            '*': {
                // Allow basic styling
                'color': [/^#(0x)?[0-9a-fA-F]{3,6}$/, /^rgb\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\)$/],
                'text-align': [/^left$/, /^right$/, /^center$/, /^justify$/],
                'font-size': [/^\d+(?:px|em|%)$/],
                'background-color': [/^#(0x)?[0-9a-fA-F]{3,6}$/, /^rgb\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\)$/],
            },
        },
        allowedSchemes: ['data', 'http', 'https'],
        disallowedTagsMode: 'discard',
    });
};