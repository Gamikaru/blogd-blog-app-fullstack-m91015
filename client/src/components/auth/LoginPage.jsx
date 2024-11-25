// src/components/LoginPage.jsx
import debounce from 'lodash.debounce';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

import { Button, InputField, Spinner } from '@components';
import { useNotificationContext, usePublicModalContext } from '@contexts';
import { useUserUpdate } from '@contexts/UserContext';
import { logger, validateLoginForm } from '@utils';

const LoginPage = () => {
    const [loginForm, setLoginForm] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const { showNotification } = useNotificationContext();
    const { togglePublicModal } = usePublicModalContext();
    const navigate = useNavigate();
    const { login } = useUserUpdate();

    const updateLoginForm = useCallback((value) => {
        setLoginForm((prevForm) => ({ ...prevForm, ...value }));
    }, []);

    const handleChange = useCallback(
        (field) => (e) => {
            updateLoginForm({ [field]: e.target.value });
        },
        [updateLoginForm]
    );

    const debouncedValidation = useMemo(
        () =>
            debounce((fieldName, form) => {
                const validationErrors = validateLoginForm(form);
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    [fieldName]: validationErrors[fieldName] || undefined,
                }));
            }, 300),
        []
    );

    useEffect(() => {
        return () => {
            debouncedValidation.cancel();
        };
    }, [debouncedValidation]);

    const handleBlur = useCallback(
        (fieldName) => {
            debouncedValidation(fieldName, loginForm);
        },
        [debouncedValidation, loginForm]
    );

    const handleLogin = async (e) => {
        e.preventDefault();
        logger.info('Login form submitted', loginForm);

        const validationErrors = validateLoginForm(loginForm);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setLoading(true);
        const result = await login(loginForm);

        if (!result.success) {
            const errorMsg = result.message || 'Login failed. Please try again.';
            showNotification(errorMsg, 'error');
            logger.error('Login failed', result);
            setLoading(false);
            return;
        }

        logger.info('Login successful.');
        navigate('/');
    };

    if (loading) {
        return <Spinner message="Logging you in..." />;
    }

    return (
        <div className="login-page">
            <div className="login-container">
                <img
                    alt="CodeBlogs logo"
                    className="logo-image"
                    src="/assets/images/High-Resolution-Logo-Black-on-Transparent-Background.png"
                />

                <div className="login-card">
                    <h1 className="login-card-header">Welcome</h1>
                    <form onSubmit={handleLogin}>
                        <div className="login-input-container">
                            <InputField
                                value={loginForm.email}
                                onChange={handleChange('email')}
                                onBlur={() => handleBlur('email')}
                                placeholder="Enter your email"
                                className={`login-input-field ${errors.email ? 'invalid-input' : ''}`}
                                error={errors.email}
                                type="email"
                            />
                        </div>

                        <div className="login-input-container">
                            <InputField
                                value={loginForm.password}
                                onChange={handleChange('password')}
                                onBlur={() => handleBlur('password')}
                                placeholder="Enter your password"
                                type={showPassword ? 'text' : 'password'}
                                className={`login-input-field ${errors.password ? 'invalid-input' : ''}`}
                                error={errors.password}
                                suffix={
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="password-toggle-button"
                                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                                    >
                                        {showPassword ? <FiEyeOff /> : <FiEye />}
                                    </button>
                                }
                            />
                        </div>

                        <div className="login-submit-container">
                            <Button
                                type="submit"
                                variant="submit"
                            >
                                Log In
                            </Button>
                        </div>
                    </form>

                    <div className="register-container">
                        <p className="register-text">
                            Not yet registered?{' '}
                            <span
                                className="register-link"
                                onClick={() => togglePublicModal('register')}
                                role="button"
                                tabIndex={0}
                            >
                                Sign up now!
                            </span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;