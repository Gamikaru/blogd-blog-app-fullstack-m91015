// src/utils/base64ToBlobUrl.js

/**
 * Converts base64 data to a Blob URL for image display.
 * @param {string} base64Data - The base64-encoded image data.
 * @param {string} [contentType='image/jpeg'] - The MIME type of the image.
 * @returns {string} - A Blob URL that can be used in image src attributes.
 */
export const base64ToBlobUrl = (base64Data, contentType = 'image/jpeg') => {
    if (!base64Data) return '';

    const byteCharacters = atob(base64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
        const slice = byteCharacters.slice(offset, offset + 512);
        const byteNumbers = new Array(slice.length);

        for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, { type: contentType });
    return URL.createObjectURL(blob);
};
