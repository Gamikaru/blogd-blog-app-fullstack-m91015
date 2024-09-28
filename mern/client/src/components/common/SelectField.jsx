import React, { forwardRef } from "react";

const SelectField = forwardRef(({ label, options, value, onChange, error, className }, ref) => (
   <div className="select-field-wrapper">
      {label && <label className="select-label">{label}</label>}
      <div className="select-container">
         <select
            value={value}
            onChange={onChange}
            className={`select-control ${className} ${error ? 'is-invalid' : ''}`}
            ref={ref}
            aria-label={label}
         >
            <option value="">Select</option>
            {options.map((option, index) => (
               <option key={index} value={option}>
                  {option}
               </option>
            ))}
         </select>
      </div>
      {error && <span className="error-label">{error}</span>}
   </div>
));

export default SelectField;
