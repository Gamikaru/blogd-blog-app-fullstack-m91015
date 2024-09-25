
import React from "react";
import { Toast } from "react-bootstrap";
import { BsCheckCircle, BsExclamationCircle, BsExclamationTriangle, BsInfoCircle } from "react-icons/bs";


const CustomToast = ({ message, show, type, onClose, delay = 6000, position = { top: '40%', left: '50%' } }) => {
   const iconColorMap = {
      success: "green",
      error: "red",
      info: "blue",
      warning: "orange",
   };

   const iconMap = {
      success: <BsCheckCircle className="me-2" style={{ color: iconColorMap.success, fontSize: "1.5rem" }} />,
      error: <BsExclamationCircle className="me-2" style={{ color: iconColorMap.error, fontSize: "1.5rem" }} />,
      info: <BsInfoCircle className="me-2" style={{ color: iconColorMap.info, fontSize: "1.5rem" }} />,
      warning: <BsExclamationTriangle className="me-2" style={{ color: iconColorMap.warning, fontSize: "1.5rem" }} />,
   };

   return (
      message && (
         <Toast
            className={`toast toast--${type} ${show ? "toast--show" : ""}`}
            style={{
               position: 'fixed', // Ensure it's fixed to the viewport
               top: position.top, // Use the top position dynamically
               left: position.left, // Use the left position dynamically
               transform: 'translate(-50%, -50%)', // Center it properly
               zIndex: 3060, // Ensure it's above the modal (default modal z-index in Bootstrap is 1050)
               minWidth: '300px', // Ensure it's visible on small screens
            }}
            onClose={onClose}
            autohide={true}
            delay={delay}
         >
            <Toast.Body className={`toast-body-${type} align-items-center`}>
               {iconMap[type] || iconMap.info}
               {message}
            </Toast.Body>
         </Toast>
      )
   );
};

export default CustomToast;
