import React from 'react';
import { motion } from 'framer-motion';
import BlogdGraphic from '../../../public/assets/images/Icon-Only-Black.png';

const Spinner = React.memo(({ size = '60px', message = '' }) => {
    return (
        <div className="spinner-container" style={spinnerContainerStyle}>
            <motion.img
                src={BlogdGraphic}
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
});

// Inline styles retained for full-screen centering
const spinnerContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh', // Full viewport height
    textAlign: 'center',
};

export default Spinner;
