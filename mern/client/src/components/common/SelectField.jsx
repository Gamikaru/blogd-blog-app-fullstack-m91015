import React from "react";

const SelectField = ({ label, options, value, onChange, error }) => (
   <div className="select-field-wrapper">
      {label && <label className="select-label">{label}</label>}
      <div className="select-container">
         <select
            value={value}
            onChange={onChange}
            className={`select-control ${error ? 'is-invalid' : ''}`}
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

);

export default SelectField;
