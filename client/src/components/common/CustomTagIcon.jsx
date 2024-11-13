// src/components/CustomTagIcon.jsx

import PropTypes from 'prop-types';
import React from 'react';

const CustomTagIcon = React.memo(({ className = '', text = '' }) => {
    if (!text) return null;

    const textLength = text.length;
    const baseWidth = 50;
    const charWidth = 8;
    const padding = 9;
    const width = baseWidth + textLength * charWidth;

    const textXPosition = width / 2; // Center the text

    return (
        <svg
            className={className}
            style={{ verticalAlign: 'middle' }}
            xmlns="http://www.w3.org/2000/svg"
            viewBox={`0 0 ${width} 24`}
            width={width}
            height="24"
            role="img"
            aria-labelledby={`custom-tag-icon-title-${text}`}
        >
            <title id={`custom-tag-icon-title-${text}`}>{`Custom Tag: ${text}`}</title>
            <rect x="0" y="0" width={width - padding} height="24" fill="#afacaa" rx="4" ry="4" />
            <polygon points={`${width - padding},0 ${width},12 ${width - padding},24`} fill="#afacaa" />
            <circle cx="12" cy="12" r="3" fill="#fff" />
            <text
                x={textXPosition}
                y="16"
                fill="#fff"
                fontSize="12"
                textAnchor="middle"
                dominantBaseline="middle"
            >
                {text}
            </text>
        </svg>
    );
});

CustomTagIcon.propTypes = {
    className: PropTypes.string,
    text: PropTypes.string.isRequired,
};

export default CustomTagIcon;