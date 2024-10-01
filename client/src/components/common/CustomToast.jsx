import { React, useEffect } from "react";
import {
   BsCheckCircle,
   BsExclamationCircle,
   BsInfoCircle,
   BsXCircle,
} from "react-icons/bs";

// CustomToast component definition
const CustomToast = ({ message, show, type, onClose, delay = 5000, position, autoClose = true, onConfirm, onCancel }) => {
   const iconColorMap = {
      success: "#27ae60",       // Green for success
      error: "#e74c3c",         // Red for error
      info: "#9191ec",          // Blue for info
      warning: "#e74c3c",       // Red Circle for warning
   };

   // Automatically close the toast after the delay if autoClose is enabled
   useEffect(() => {
      if (show && autoClose) {
         const timeout = setTimeout(onClose, delay); // Auto-close after the delay
         return () => clearTimeout(timeout); // Clear timeout on unmount
      }
   }, [show, delay, onClose, autoClose]);

   // Set the appropriate icons for each type
   const iconMap = {
      success: <BsCheckCircle className="toast-icon" style={{ color: iconColorMap.success }} />,
      error: <BsExclamationCircle className="toast-icon" style={{ color: iconColorMap.error }} />, // Red Circle for error
      info: <BsInfoCircle className="toast-icon" style={{ color: iconColorMap.info }} />,
      warning: <BsExclamationCircle className="toast-icon" style={{ color: iconColorMap.warning }} />, // Red Circle for warning
   };

   // Dynamic positioning style based on the provided position prop
   const positionStyle = position === "top-right"
      ? { top: "70px", right: "20px", transform: "translateY(0)" }  // Top-right for success
      : { top: "50%", left: "50%", transform: "translate(-50%, -50%)" };  // Centered for error or default

   return (
      show && (
         <div
            className={`custom-toast custom-toast--${type} ${show ? "custom-toast--show" : "custom-toast--hide"}`}
            style={{
               position: "fixed", // Fixed to the screen
               ...positionStyle,  // Dynamic position based on prop
               zIndex: 3060,
               minWidth: "320px",
               borderLeft: `4px solid ${iconColorMap[type]}`, // Left border in the corresponding color
               borderBottom: `4px solid ${iconColorMap[type]}`, // Bottom border in the corresponding color
            }}
         >
            <div className="custom-toast-header">
               {iconMap[type] || iconMap.info}
               <strong className="me-auto">{type.toUpperCase()}</strong>
               <BsXCircle className="close-button" onClick={onClose} />
            </div>
            <div className="custom-toast-body">
               {typeof message === "string" ? message : message}
            </div>
            {/* Only render buttons if onConfirm and onCancel props are provided */}
            {onConfirm && onCancel && (
               <div className="toast-actions">
                  <button className="toast-primary-btn" onClick={onConfirm}>Yes</button>
                  <button className="toast-secondary-btn" onClick={onCancel}>No</button>
               </div>
            )}
         </div>
      )
   );
};

export default CustomToast;
