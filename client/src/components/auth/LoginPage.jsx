// src/components/LoginPage.jsx
// Desc: Login page for the application

import debounce from 'lodash.debounce';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Card } from 'react-bootstrap';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
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
    const { showNotification, hideNotification } = useNotificationContext();
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
        try {
            const result = await login(loginForm);

            if (!result.success) {
                const errorMsg = result.message || 'Login failed. Please try again.';
                showNotification(errorMsg, 'error');
                logger.error('Login failed', result);
                return;
            }

            logger.info('Login successful.');
            hideNotification();
            navigate('/');
        } catch (error) {
            logger.error('Login error', error);
            showNotification(error.message || 'An error occurred. Please try again.', 'error');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <Spinner message="Logging you in..." />;
    }

    return (
        <div className="login-page">
            <div className="login-container d-flex flex-column justify-content-center align-items-center">
                <img
                    alt="CodeBlogs logo"
                    className="logo-image"
                    src="/assets/images/High-Resolution-Logo-Black-on-Transparent-Background.png"
                />

                <div className="login-card-container w-100 d-flex justify-content-center">
                    <Card className="login-card">
                        <Card.Body>
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

                                <div className="login-input-container password-container">
                                    <InputField
                                        value={loginForm.password}
                                        onChange={handleChange('password')}
                                        placeholder="Enter your password"
                                        type={showPassword ? 'text' : 'password'}
                                        className={`login-input-field ${errors.password ? 'invalid-input' : ''}`}
                                        error={errors.password}
                                    />
                                    <Button
                                        type="button"
                                        onClick={() => setShowPassword((prev) => !prev)}
                                        className="button button-icon"
                                        aria-label="Toggle password visibility"
                                        variant="iconButton"
                                        icon={showPassword ? FaEye : FaEyeSlash}
                                        showIcon={true}
                                        aria-pressed={showPassword}
                                    />
                                </div>

                                <div className="login-submit-container">
                                    <Button
                                        variant="submit"
                                        type="submit"
                                    >
                                        Log In
                                    </Button>
                                </div>
                            </form>

                            <div className="text-center">
                                <p className="register-text">
                                    Not yet registered?{' '}
                                    <span
                                        className="register-link"
                                        onClick={() => togglePublicModal('register')}
                                        aria-label="Sign up now!"
                                    >
                                        Sign up now!
                                    </span>
                                </p>
                            </div>
                        </Card.Body>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
