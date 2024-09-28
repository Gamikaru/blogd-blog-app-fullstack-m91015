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
}, ref) => (
   <div className="input-field-wrapper">
      {label && <label className="input-label">{label}</label>}
      <input
         type={type}
         value={value}
         onChange={onChange}
         onBlur={onBlur}
         onKeyDown={onKeyDown}
         placeholder={placeholder}
         className={`input-control ${className}`} // Input class remains dynamic
         style={style}
         ref={ref}
         aria-label={label || placeholder}
      />
      {/* Use a static class for the error label */}
      {error && <span className="error-label">{error}</span>}
   </div>
));

export default InputField;
