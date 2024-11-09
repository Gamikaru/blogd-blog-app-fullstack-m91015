import DOMPurify from 'dompurify';

const sanitizeContent = (content) => {
    return DOMPurify.sanitize(content, {
        USE_PROFILES: { html: true }
    });
};

export default sanitizeContent;