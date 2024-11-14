// src/components/Spinner/Spinner.jsx

import { motion } from 'framer-motion';
import React from 'react';
import BlogdGraphic from '../../../public/assets/images/Icon-Only-Black.png';

const Spinner = React.memo(({ size = '60px', message = 'Loading...' }) => {
    return (
        <div className="spinner-container">
            <motion.img
                src={BlogdGraphic}
                alt="Loading spinner"
                className="spinner"
                style={{ width: size, height: size }}
                initial={{ rotate: 0, y: 0, opacity: 0 }}
                animate={{ rotate: 360, y: [-10, 0, -10], opacity: 1 }}
                transition={{
                    rotate: {
                        repeat: Infinity,
                        duration: 2,
                        ease: 'linear',
                    },
                    y: {
                        repeat: Infinity,
                        duration: 3,
                        ease: 'easeInOut',
                        yoyo: Infinity, // Deprecated in newer versions, use repeatType
                        repeatType: 'mirror',
                    },
                    opacity: {
                        duration: 1.5,
                        ease: 'easeInOut',
                        repeat: Infinity,
                        repeatType: 'mirror',
                    },
                }}
            />
            {message && <p className="spinner-message">{message}</p>}
        </div>
    );
});

export default Spinner;
