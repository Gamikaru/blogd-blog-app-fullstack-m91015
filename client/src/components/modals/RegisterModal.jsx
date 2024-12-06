// src/components/RegisterModal.jsx

import { Button, InputField, SelectField } from '@components';
import { useNotificationContext, usePublicModalContext, useUserUpdate } from '@contexts';
import { userService } from '@services/api';
import { capitalizeFirstLetter, logger, validateRegForm } from '@utils';
import { useEffect, useRef, useState } from "react";
import { Form, Modal } from "react-bootstrap";
import { useCookies } from "react-cookie";
import SimpleBar from 'simplebar-react';
import 'simplebar-react/dist/simplebar.min.css';

const initialFormState = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    birthDate: "",
    occupation: "",
    location: "",
    status: "",
    authLevel: "basic",
};

export default function RegisterModal() {
    const [registerForm, setRegisterForm] = useState(initialFormState);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const { setUser } = useUserUpdate();
    const [setCookie] = useCookies(["BlogdPass", "userId"]);
    const { showModal, togglePublicModal } = usePublicModalContext();
    const { showNotification, setPosition } = useNotificationContext();

    // Initialize refs for form inputs
    const inputRefs = useRef({
        firstName: null,
        lastName: null,
        email: null,
        password: null,
        confirmPassword: null,
        birthDate: null,
        occupation: null,
        location: null,
    });

    function updateRegisterForm(value) {
        logger.info("Updating register form", value);
        setRegisterForm((prev) => ({ ...prev, ...value }));
    }

    useEffect(() => {
        setPosition('info', false); // Always center for public routes like registration
    }, [setPosition]);

    // Focus on first error field
    const focusFirstErrorField = (formErrors) => {
        const firstErrorField = Object.keys(formErrors)[0];
        if (inputRefs.current[firstErrorField]) {
            inputRefs.current[firstErrorField].focus();
        }
    };

    async function handleRegister(e) {
        e.preventDefault();
        logger.info("Form submitted", registerForm);

        const { errors: formErrors, allFieldsEmpty } = validateRegForm(registerForm);
        setErrors(formErrors);

        if (Object.keys(formErrors).length > 0) {
            if (allFieldsEmpty) {
                showNotification("All fields are required.", "error");
            } else {
                showNotification("Please fill out the required fields correctly.", "error");
            }

            // Focus on the first invalid field
            focusFirstErrorField(formErrors);
            return;
        }

        // Capitalize form fields where applicable
        const capitalizedForm = {
            ...registerForm,
            firstName: capitalizeFirstLetter(registerForm.firstName),
            lastName: capitalizeFirstLetter(registerForm.lastName),
            occupation: capitalizeFirstLetter(registerForm.occupation),
            email: registerForm.email.toLowerCase(),
        };

        setLoading(true);
        try {
            const response = await userService.registerUser(capitalizedForm);
            if (response.message) {
                showNotification(response.message, "success");

                const userData = response.user;
                if (userData) {
                    setCookie("BlogdPass", response.token, { path: "/", maxAge: 24 * 60 * 60 });
                    setCookie("userId", userData._id, { path: "/", maxAge: 24 * 60 * 60 });
                    setUser(userData);
                }

                // Delay modal close to allow users to see success toast
                setTimeout(() => {
                    togglePublicModal();
                    setRegisterForm(initialFormState);
                    setErrors({});  // Clear errors after success
                }, 4000);  // Increase timing for better UX
            }
        } catch (error) {
            showNotification(error.message || "Registration failed due to an unexpected error.", "error");
            logger.error("Registration failed", { error });
        } finally {
            setLoading(false);
        }
    }

    const capitalCities = [
        "Washington, D.C.", "Ottawa", "Mexico City", "London", "Paris", "Berlin",
        "Rome", "Madrid", "Tokyo", "Beijing", "Canberra", "Brasília", "Moscow",
        "New Delhi", "Cairo", "Buenos Aires", "Ankara", "Seoul", "Bangkok", "Jakarta"
    ];

    return (
        <Modal
            show={showModal}
            onHide={togglePublicModal}
            centered
            className="register-modal"
            backdropClassName="register-modal__backdrop"
            container={document.body}
        >
            <SimpleBar style={{ maxHeight: '100%' }} className="register-modal-container">
                <Form onSubmit={handleRegister} className="register-modal__form">
                    <Modal.Header closeButton className="modal-header">
                        <Modal.Title className="register-modal__title">REGISTER</Modal.Title>
                    </Modal.Header>

                    <div className="register-modal__body">
                        <div className="form-column">
                            <InputField
                                placeholder="Enter your first name"
                                value={registerForm.firstName}
                                onChange={(e) => updateRegisterForm({ firstName: e.target.value })}
                                error={errors.firstName}
                                className="register-modal-input"
                                ref={(el) => (inputRefs.current.firstName = el)}
                            />
                            <InputField
                                placeholder="Enter your email"
                                type="email"
                                value={registerForm.email}
                                onChange={(e) => updateRegisterForm({ email: e.target.value })}
                                error={errors.email}
                                className="register-modal-input"
                                ref={(el) => (inputRefs.current.email = el)}
                            />
                            <InputField
                                type="date"
                                value={registerForm.birthDate}
                                onChange={(e) => updateRegisterForm({ birthDate: e.target.value })}
                                error={errors.birthDate}
                                className="register-modal-input"
                                ref={(el) => (inputRefs.current.birthDate = el)}
                            />
                        </div>

                        <div className="form-column">
                            <InputField
                                placeholder="Enter your last name"
                                value={registerForm.lastName}
                                onChange={(e) => updateRegisterForm({ lastName: e.target.value })}
                                error={errors.lastName}
                                className="register-modal-input"
                                ref={(el) => (inputRefs.current.lastName = el)}
                            />
                            <InputField
                                placeholder="Enter your password"
                                type="password"
                                value={registerForm.password}
                                onChange={(e) => updateRegisterForm({ password: e.target.value })}
                                error={errors.password}
                                className="register-modal-input"
                                ref={(el) => (inputRefs.current.password = el)}
                            />
                            <InputField
                                placeholder="Confirm your password"
                                type="password"
                                value={registerForm.confirmPassword}
                                onChange={(e) => updateRegisterForm({ confirmPassword: e.target.value })}
                                error={errors.confirmPassword}
                                className="register-modal-input"
                                ref={(el) => (inputRefs.current.confirmPassword = el)}
                            />
                            <InputField
                                placeholder="Enter your occupation"
                                value={registerForm.occupation}
                                onChange={(e) => updateRegisterForm({ occupation: e.target.value })}
                                error={errors.occupation}
                                className="register-modal-input"
                                ref={(el) => (inputRefs.current.occupation = el)}
                            />
                        </div>

                        <div className="form-row">
                            <SelectField
                                options={capitalCities}
                                value={registerForm.location}
                                onChange={(e) => updateRegisterForm({ location: e.target.value })}
                                error={errors.location}
                                className="register-modal-input"
                                ref={(el) => (inputRefs.current.location = el)}
                            />
                        </div>
                    </div>

                    <div className="register-modal__footer">
                        <div className="submit-container" style={{ display: 'flex'}}>
                            <Button
                                variant="submit"
                                disabled={loading}
                                classname="button button-register"
                            >
                                {loading ? 'Registering...' : 'Register'}
                            </Button>
                        </div>
                    </div>
                </Form>
            </SimpleBar>
        </Modal>
    );
};