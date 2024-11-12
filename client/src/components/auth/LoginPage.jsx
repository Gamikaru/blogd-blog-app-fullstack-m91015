//LoginPage.jsx
//Desc: Login page for the application

import debounce from 'lodash.debounce'; // Optimize form validations
import { useCallback, useMemo, useState } from 'react';
import { Card } from 'react-bootstrap';
import { useCookies } from 'react-cookie';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

import { Button, InputField, Spinner } from '@components';
import { useNotificationContext, usePublicModalContext, useUserUpdate } from '@contexts';
import { UserService } from '@services/api';
import { logger, validateLoginForm } from '@utils';

export default function LoginPage() {
    const [loginForm, setLoginForm] = useState({ email: "", password: "" });
    const [, setCookie] = useCookies(["BlogdPass", "userID"]);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const { showNotification, hideNotification } = useNotificationContext();
    const { togglePublicModal } = usePublicModalContext();
    const navigate = useNavigate();
    const setUser = useUserUpdate();

    const updateLoginForm = useCallback((value) => {
        setLoginForm((prevForm) => ({ ...prevForm, ...value }));
    }, []);

    const debouncedValidation = useMemo(
        () => debounce((fieldName, form) => {
            const validationErrors = validateLoginForm(form);
            setErrors((prevErrors) => ({
                ...prevErrors,
                [fieldName]: validationErrors[fieldName] || undefined
            }));
        }, 300),
        []
    );

    const handleBlur = useCallback((fieldName) => {
        if (fieldName === "email") {
            debouncedValidation("email", loginForm);
        }
    }, [debouncedValidation, loginForm]);

    const handleLogin = async (e) => {
        e.preventDefault();
        logger.info("Login form submitted", loginForm);

        const validationErrors = validateLoginForm(loginForm);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setLoading(true);
        try {
            const response = await UserService.loginUser(loginForm);

            if (!response || !response.token || !response.user?.userId) {
                const errorMsg = response?.user
                    ? "Incorrect password for this user."
                    : "No user found with this email.";
                showNotification(errorMsg, "error");
                logger.error("Login failed", response);
                setLoading(false);
                return;
            }

            setCookie("BlogdPass", response.token, { path: "/", maxAge: 24 * 60 * 60 });
            setCookie("userID", response.user.userId, { path: "/", maxAge: 24 * 60 * 60 });

            logger.info("Cookies set successfully.");
            setTimeout(() => {
                setUser(response.user);
                hideNotification();
                navigate("/");
            }, 2000);
        } catch (error) {
            logger.error("Login error", error);
            showNotification(error.message || "An error occurred. Please try again.", "error");
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <Spinner message="Logging you in..." />;

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
                                        onChange={(e) => updateLoginForm({ email: e.target.value })}
                                        onBlur={() => handleBlur("email")}
                                        placeholder="Enter your email"
                                        className={`login-input-field ${errors.email ? "invalid-input" : ""}`}
                                        error={errors.email}
                                    />
                                </div>

                                <div className="login-input-container password-container">
                                    <InputField
                                        value={loginForm.password}
                                        onChange={(e) => updateLoginForm({ password: e.target.value })}
                                        placeholder="Enter your password"
                                        type={showPassword ? "text" : "password"}
                                        className={`login-input-field ${errors.password ? "invalid-input" : ""}`}
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
                                    />
                                </div>

                                <div className="login-submit-container">
                                    <Button
                                        type="submit"
                                        variant="submit"
                                        className="button button-submit"
                                    >
                                        {loading ? "Logging in..." : "LOGIN"}
                                    </Button>
                                </div>
                            </form>

                            <div className="text-center">
                                <p className="register-text">
                                    Not yet registered?{" "}
                                    <span
                                        className="register-link"
                                        onClick={() => togglePublicModal("register")}
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
}
