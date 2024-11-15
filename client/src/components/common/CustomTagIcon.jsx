// client/src/components/CustomTagIcon.jsx
import PropTypes from 'prop-types';
import React, { useMemo } from 'react';

const CustomTagIcon = React.memo(({ className = '', text = '' }) => {
    const textLength = text.length;
    const width = useMemo(() => Math.min(200, 50 + textLength * 8), [textLength]);
    const textXPosition = width / 2;

    if (!text) return null;

    return (
        <svg
            className={className}
            xmlns="http://www.w3.org/2000/svg"
            viewBox={`0 0 ${width} 24`}
            width={width}
            height="24"
            role="img"
            aria-labelledby={`custom-tag-icon-title-${text}`}
        >
            <title id={`custom-tag-icon-title-${text}`}>{`Custom Tag: ${text}`}</title>
            <rect x="0" y="0" width={width - 9} height="24" fill="#afacaa" rx="4" ry="4" />
            <polygon points={`${width - 9},0 ${width},12 ${width - 9},24`} fill="#afacaa" />
            <circle cx="12" cy="12" r="3" fill="#fff" />
            <text
                x={textXPosition}
                y="16"
                fill="#fff"
                fontSize="12"
                textAnchor="middle"
                dominantBaseline="middle"
            >
                {text.length > 20 ? `${text.slice(0, 17)}...` : text}
            </text>
        </svg>
    );
});

CustomTagIcon.displayName = 'CustomTagIcon';

CustomTagIcon.propTypes = {
    className: PropTypes.string,
    text: PropTypes.string.isRequired,
};

export default CustomTagIcon;