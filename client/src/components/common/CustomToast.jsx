import { AnimatePresence, motion } from 'framer-motion';
import React, { useCallback, useEffect, useMemo } from 'react';
import { FiAlertCircle, FiCheckCircle, FiInfo, FiX } from 'react-icons/fi';

const CustomToast = React.memo(({
    message,
    show,
    type = 'info',
    onClose,
    delay = 5000,
    position = 'top-right',
    autoClose = true,
    onConfirm,
    onCancel,
}) => {
    const iconMap = useMemo(() => ({
        success: <FiCheckCircle className="toast-icon" />,
        error: <FiAlertCircle className="toast-icon" />,
        info: <FiInfo className="toast-icon" />,
        warning: <FiAlertCircle className="toast-icon" />,
    }), []);

    useEffect(() => {
        if (show && autoClose) {
            const timeout = setTimeout(onClose, delay);
            return () => clearTimeout(timeout);
        }
    }, [show, delay, onClose, autoClose]);

    const toastVariants = {
        initial: {
            x: position === 'top-right' ? 100 : 0,
            opacity: 0,
        },
        animate: {
            x: 0,
            opacity: 1,
            transition: {
                type: 'spring',
                damping: 20,
                stiffness: 300,
            },
        },
        exit: {
            x: position === 'top-right' ? 100 : 0,
            opacity: 0,
            transition: {
                duration: 0.2,
            },
        },
    };

    const ButtonVariants = {
        initial: { scale: 1 },
        hover: { scale: 1.02 },
        tap: { scale: 0.98 },
    };

    const positionStyle = useMemo(() => (
        position === 'top-right'
            ? { top: '5rem', right: '2rem' }
            : { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }
    ), [position]);

    const handleDragEnd = useCallback((_, info) => {
        if (info.offset.x > 100) onClose();
    }, [onClose]);

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    className={`custom-toast custom-toast--${type}`}
                    variants={toastVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    drag={position === 'top-right' ? 'x' : false}
                    dragConstraints={{ left: 0, right: 20 }}
                    dragElastic={0.7}
                    onDragEnd={handleDragEnd}
                    style={{
                        position: 'fixed',
                        ...positionStyle,
                        zIndex: 3060,
                    }}
                    role="alert"
                    aria-live="assertive"
                >
                    <div className="custom-toast-content">
                        <div className="toast-icon-wrapper">
                            {iconMap[type]}
                        </div>
                        <div className="toast-message">
                            {message}
                        </div>
                        <motion.button
                            className="toast-close"
                            onClick={onClose}
                            variants={ButtonVariants}
                            whileHover="hover"
                            whileTap="tap"
                            aria-label="Close notification"
                        >
                            <FiX />
                        </motion.button>
                    </div>
                    {(onConfirm || onCancel) && (
                        <div className="toast-actions">
                            {onConfirm && (
                                <motion.button
                                    className="toast-action-btn primary"
                                    onClick={onConfirm}
                                    variants={ButtonVariants}
                                    whileHover="hover"
                                    whileTap="tap"
                                >
                                    Confirm
                                </motion.button>
                            )}
                            {onCancel && (
                                <motion.button
                                    className="toast-action-btn secondary"
                                    onClick={onCancel}
                                    variants={ButtonVariants}
                                    whileHover="hover"
                                    whileTap="tap"
                                >
                                    Cancel
                                </motion.button>
                            )}
                        </div>
                    )}
                </motion.div>
            )}
        </AnimatePresence>
    );
});

export default CustomToast;
