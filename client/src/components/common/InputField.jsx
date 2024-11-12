import { forwardRef, memo, useMemo } from "react";

const InputField = forwardRef(({
    label,
    value,
    onChange,
    onBlur,
    onKeyDown,
    error,
    helperText,
    placeholder = "Enter value",
    type = "text",
    className = "",
    style,
}, ref) => {
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
            <input
                id={sanitizedId}
                type={type}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                onKeyDown={onKeyDown}
                placeholder={placeholder}
                className={`input-control ${error ? "input-error" : ""} ${className}`}
                style={style}
                ref={ref}
                aria-label={label || placeholder}
                aria-describedby={errorId}
                aria-invalid={!!error}
            />
            {error && <span id={errorId} className="error-label">{error}</span>}
            {!error && helperText && (
                <span className="helper-text">{helperText}</span>
            )}
        </div>
    );
});

export default memo(InputField);
