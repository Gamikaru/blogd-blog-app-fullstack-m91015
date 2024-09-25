// components/common/SelectField.jsx

import React from "react";

const SelectField = ({ label, options, value, onChange, error }) => {
   return (
      <div className="mb-3">
         <label>{label}</label>
         <select value={value} onChange={onChange} className={`form-control ${error ? 'is-invalid' : ''}`}>
            <option value="">Select</option>
            {options.map((option, index) => (
               <option key={index} value={option}>
                  {option}
               </option>
            ))}
         </select>
         {error && <div className="invalid-feedback">{error}</div>}
      </div>
   );
};

export default SelectField;
