import React from 'react';

const CustomTagIcon = ({ className, text }) => {
    if (!text) {
        return null; // Return null if text is undefined
    }

    const textLength = text.length;
    const width = 50 + textLength * 8; // Adjust the width based on the text length

    return (
        <svg
            className={className}
            style={{ verticalAlign: 'middle' }}
            xmlns="http://www.w3.org/2000/svg"
            viewBox={`0 0 ${width} 24`}
            width={width}
            height="24"
        >
            <rect x="0" y="0" width={width - 9} height="24" fill="#afacaa" />
            <polygon points={`${width - 10},0 ${width},12 ${width - 10},24`} fill="#afacaa" />
            <circle cx="12" cy="12" r="3" fill="#fff" />
            <text x="25" y="16" fill="#fff" fontSize="12" >{text}</text>
        </svg>
    );
};

export default CustomTagIcon;