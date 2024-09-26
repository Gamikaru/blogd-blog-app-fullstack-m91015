import React from "react";

const InputField = ({
   label,
   value,
   onChange,
   onBlur,
   onKeyDown,
   error,
   placeholder,
   type = "text", // Add type for password input handling
   className,
   style,
}) => (
   <div className="input-field-wrapper">
      {label && <label className="input-label">{label}</label>}
      <input
         type={type} // Add type prop for password vs text
         value={value}
         onChange={onChange}
         onBlur={onBlur}
         onKeyDown={onKeyDown}
         placeholder={placeholder}
         className={`input-control ${className}`} // Accept a class name for customization
         style={style} // Allow inline style overrides
      />
      {error && <span className="error-label">{error}</span>}
   </div>
);

export default InputField;
