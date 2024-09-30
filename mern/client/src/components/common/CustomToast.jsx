import { React, useEffect } from "react";
import {
   BsCheckCircle,
   BsExclamationCircle,
   BsExclamationTriangle,
   BsInfoCircle,
   BsXCircle,
} from "react-icons/bs";

const CustomToast = ({ message, show, type, onClose, delay = 5000, position }) => {
   const iconColorMap = {
      success: "#27ae60",
      error: "#e74c3c",
      info: "#9191ec",
      warning: "#f39c12",
   };

   useEffect(() => {
      if (show) {
         const timeout = setTimeout(onClose, delay); // Auto close after the dynamic delay
         return () => clearTimeout(timeout); // Clear timeout on unmount
      }
   }, [show, delay, onClose]);

   const iconMap = {
      success: <BsCheckCircle className="toast-icon" style={{ color: iconColorMap.success }} />,
      error: <BsExclamationCircle className="toast-icon" style={{ color: iconColorMap.error }} />,
      info: <BsInfoCircle className="toast-icon" style={{ color: iconColorMap.info }} />,
      warning: <BsExclamationTriangle className="toast-icon" style={{ color: iconColorMap.warning }} />,
   };

   const positionStyle = position === "top-right"
      ? { top: "70px", right: "20px", transform: "translateY(0)" }  // Top-right for success
      : { top: "50%", left: "50%", transform: "translate(-50%, -50%)" };  // Centered for error or default

   return (
      message && (
         <div
            className={`custom-toast custom-toast--${type} ${show ? "custom-toast--show" : "custom-toast--hide"}`}
            style={{
               position: "fixed", // Fixed to screen
               ...positionStyle,  // Dynamic position based on prop
               zIndex: 3060,
               minWidth: "320px",
            }}
         >
            <div className="custom-toast-header">
               {iconMap[type] || iconMap.info}
               <strong className="me-auto">{type.toUpperCase()}</strong>
               <BsXCircle className="close-button" onClick={onClose} />
            </div>
            <div className="custom-toast-body">{message}</div>
         </div>
      )
   );
};

export default CustomToast;
