// components/common/InputField.jsx

import React from "react";

const InputField = ({ label, value, onChange, error, type = "text" }) => {
   return (
      <div className="mb-3">
         <label>{label}</label>
         <input
            type={type}
            value={value}
            placeholder={label}
            onChange={onChange}
            className={`form-control ${error ? 'is-invalid' : ''}`}
         />
         {error && <div className="invalid-feedback">{error}</div>}
      </div>
   );
};

export default InputField;
