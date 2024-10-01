import React from 'react';
import CodeBloggsGraphic from '../../../public/assets/images/CodeBloggsGraphic.png'; // Import spinner image

const Spinner = ({ size = '60px', message = '' }) => {
   return (
      <div className="spinner-container" style={spinnerContainerStyle}>
         <img
            src={CodeBloggsGraphic}
            alt="Loading spinner"
            className="spinner"
            style={{ width: size, height: size, animation: 'spin 1s linear infinite' }}
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
   textAlign: 'center',  // Center text
};

export default Spinner;
