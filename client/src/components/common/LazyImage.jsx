// src/components/LazyImage.jsx

import PropTypes from 'prop-types';
import { Suspense } from 'react';

const LazyImage = ({ src, alt, className = '' }) => {
    return (
        <Suspense fallback={<div className="image-placeholder">Loading...</div>}>
            <img src={src} alt={alt} className={className} loading="lazy" />
        </Suspense>
    );
};

LazyImage.propTypes = {
    src: PropTypes.string.isRequired,
    alt: PropTypes.string.isRequired,
    className: PropTypes.string, // Optional prop
};

// Removed LazyImage.defaultProps

export default LazyImage;