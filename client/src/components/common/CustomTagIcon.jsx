import PropTypes from 'prop-types';
import React, { useMemo } from 'react';

const CustomTagIcon = React.memo(({ className = '', text = '' }) => {
    const textLength = text.length;
    const width = useMemo(() => Math.min(200, 50 + textLength * 8), [textLength]);
    const textXPosition = (width - 14) / 2; // Center within the rectangle

    if (!text) return null;

    return (
        <svg
            className={className}
            xmlns="http://www.w3.org/2000/svg"
            viewBox={`0 0 ${width} 28`}
            width={width}
            height="28"
            role="img"
            aria-labelledby={`custom-tag-icon-title-${text}`}
        >
            <title id={`custom-tag-icon-title-${text}`}>{`Custom Tag: ${text}`}</title>

            {/* Main rectangle */}
            <rect x="5" y="2" width={width - 14} height="24" fill="#afacaa" rx="4" ry="4" />

            {/* Triangle label tail */}
            <polygon points={`${width - 10},2 ${width + 5},14 ${width - 10},26`} fill="#afacaa" />

            {/* S-Shaped string */}
            <path
                d={`M ${width - 18} 10
                   C ${width - 14} 14, ${width - 14} 14, ${width - 18} 18`}
                stroke="#b2b2b2"
                strokeWidth="2"
                fill="none"
            />

            {/* Hole (circle) */}
            <circle cx={width - 6} cy="14" r="3" fill="#fff" />

            {/* Centered text in rectangle */}
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
