import { motion } from 'framer-motion';
import React from 'react';
import CodeBloggsGraphic from '../../../public/assets/images/Icon-Only-Black.png'; // Import spinner image

const Spinner = ({ size = '60px', message = '' }) => {
    return (
        <div className="spinner-container" style={spinnerContainerStyle}>
            <motion.img
                src={CodeBloggsGraphic}
                alt="Loading spinner"
                className="spinner"
                style={{ width: size, height: size }}
                animate={{
                    rotate: [-15, 15, -15],
                    y: [0, -5, 0],
                }}
                transition={{
                    duration: 1,
                    repeat: Infinity,
                    ease: 'easeInOut',
                }}
            />
            {message && <p style={{ marginTop: '10px' }}>{message}</p>}
        </div>
    );
};

// Inline styles for centering the spinner
const spinnerContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh', // Full viewport height
    textAlign: 'center', // Center text
};

export default Spinner;
