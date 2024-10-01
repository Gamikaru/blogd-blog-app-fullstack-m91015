import React, { forwardRef } from "react";

const InputField = forwardRef(({
   label,
   value,
   onChange,
   onBlur,
   onKeyDown,
   error,
   placeholder,
   type = "text",
   className,
   style,
}, ref) => {
   const errorId = error ? `${label || placeholder}-error` : undefined;

   return (
      <div className="input-field-wrapper">
         {label && <label className="input-label" htmlFor={label || placeholder}>{label}</label>}
         <input
            id={label || placeholder}
            type={type}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            onKeyDown={onKeyDown}
            placeholder={placeholder}
            className={`input-control ${error ? "input-error" : ""} ${className}`} // Apply error class dynamically
            style={style}
            ref={ref}
            aria-label={label || placeholder}
            aria-describedby={errorId} // Associate the error message
         />
         {/* Dynamically add an id to the error span */}
         {error && <span id={errorId} className="error-label">{error}</span>}
      </div>
   );
});

export default InputField;
