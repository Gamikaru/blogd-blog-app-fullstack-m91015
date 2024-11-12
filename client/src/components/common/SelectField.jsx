import { forwardRef, memo, useMemo } from "react";

const SelectField = forwardRef(({ label, options, value, onChange, error, className }, ref) => {
    const renderedOptions = useMemo(
        () =>
            options.map((option, index) => (
                <option key={index} value={option}>
                    {option}
                </option>
            )),
        [options]
    );

    return (
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
                    {renderedOptions}
                </select>
            </div>
            {error && <span className="error-label">{error}</span>}
        </div>
    );
});

export default memo(SelectField);
