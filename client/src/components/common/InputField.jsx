// src/components/InputField.jsx

import PropTypes from 'prop-types';
import { forwardRef, memo, useMemo } from 'react';

const InputField = forwardRef(
    (
        {
            label,
            value,
            onChange,
            onBlur,
            onKeyDown,
            error,
            helperText,
            placeholder = 'Enter value',
            type = 'text',
            className = '',
            style,
            suffix, // Add this prop
        },
        ref
    ) => {
        const sanitizedId = useMemo(
            () => (label || placeholder).replace(/\s+/g, '-').toLowerCase(),
            [label, placeholder]
        );
        const errorId = error ? `${sanitizedId}-error` : undefined;

        return (
            <div className="input-field-wrapper">
                {label && (
                    <label className="input-label" htmlFor={sanitizedId}>
                        {label}
                    </label>
                )}
                <div className="input-control-wrapper">
                    <input
                        id={sanitizedId}
                        type={type}
                        value={value}
                        onChange={onChange}
                        onBlur={onBlur}
                        onKeyDown={onKeyDown}
                        placeholder={placeholder}
                        className={`input-control ${error ? 'input-error' : ''} ${className}`}
                        style={style}
                        ref={ref}
                        aria-label={label || placeholder}
                        aria-describedby={errorId}
                        aria-invalid={!!error}
                    />
                    {suffix}
                </div>
                {error && (
                    <span id={errorId} className="error-label">
                        {error}
                    </span>
                )}
                {!error && helperText && <span className="helper-text">{helperText}</span>}
            </div>
        );
    }
);
InputField.propTypes = {
    label: PropTypes.string,
    value: PropTypes.string,
    onChange: PropTypes.func,
    onBlur: PropTypes.func,
    onKeyDown: PropTypes.func,
    error: PropTypes.string,
    helperText: PropTypes.string,
    placeholder: PropTypes.string,
    type: PropTypes.string,
    className: PropTypes.string,
    style: PropTypes.object,
    suffix: PropTypes.node
};
InputField.displayName = 'InputField';

export default memo(InputField);