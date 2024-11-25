// src/components/SelectField.jsx

import PropTypes from "prop-types";
import { forwardRef, memo, useMemo } from "react";
import { FiChevronDown } from "react-icons/fi";

const SelectField = forwardRef(
    ({ options, value, onChange, error, className, ...rest }, ref) => {
        const renderedOptions = useMemo(
            () =>
                options.map((option, index) => {
                    if (typeof option === 'object' && option !== null) {
                        return (
                            <option key={index} value={option.value}>
                                {option.label}
                            </option>
                        );
                    }
                    return (
                        <option key={index} value={option}>
                            {option}
                        </option>
                    );
                }),
            [options]
        );

        return (
            <div className="select-container">
                <select
                    name={rest.name}
                    value={value}
                    onChange={onChange}
                    className={`input-control ${className} ${error ? 'is-invalid' : ''}`}
                    ref={ref}
                    {...rest}
                    aria-label={rest['aria-label'] || "Select input"}
                >
                    <option value="">Select</option>
                    {renderedOptions}
                </select>
                <FiChevronDown className="select-icon" />
                {error && <span className="error-label">{error}</span>}
            </div>
        );
    }
);

SelectField.displayName = 'SelectField';

SelectField.propTypes = {
    options: PropTypes.arrayOf(
        PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.shape({
                label: PropTypes.string.isRequired,
                value: PropTypes.string.isRequired,
            }),
        ])
    ).isRequired,
    value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
        PropTypes.bool,
        PropTypes.object,
    ]).isRequired,
    onChange: PropTypes.func.isRequired,
    error: PropTypes.string,
    className: PropTypes.string,
};

export default memo(SelectField);