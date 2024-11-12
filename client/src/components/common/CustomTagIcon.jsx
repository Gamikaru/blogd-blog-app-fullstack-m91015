
const CustomTagIcon = ({ className = '', text = '' }) => {
    if (!text) return null;

    const textLength = text.length;
    const baseWidth = 50;
    const charWidth = 8;
    const padding = 9;
    const width = baseWidth + textLength * charWidth;

    const textXPosition = baseWidth / 2; // Dynamic positioning for better centering.

    return (
        <svg
            className={className}
            style={{ verticalAlign: 'middle' }}
            xmlns="http://www.w3.org/2000/svg"
            viewBox={`0 0 ${width} 24`}
            width={width}
            height="24"
            role="img" // Accessibility
            aria-labelledby="custom-tag-icon-title"
        >
            <title id="custom-tag-icon-title">{`Custom Tag: ${text}`}</title>
            <rect x="0" y="0" width={width - padding} height="24" fill="#afacaa" />
            <polygon points={`${width - 10},0 ${width},12 ${width - 10},24`} fill="#afacaa" />
            <circle cx="12" cy="12" r="3" fill="#fff" />
            <text
                x={textXPosition}
                y="16"
                fill="#fff"
                fontSize="12"
                textAnchor="middle" // Centers the text horizontally
            >
                {text}
            </text>
        </svg>
    );
};

export default CustomTagIcon;
