//RegisterModal.jsx

import { InputField, Logger, SelectField, UserService, capitalizeFirstLetter, useNotificationContext, usePublicModalContext, useUserUpdate, validateRegForm } from '@components';
import React, { useEffect, useRef, useState } from "react";
import { useCookies } from "react-cookie";

const initialFormState = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",  // Added confirm password
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
    const setUser = useUserUpdate();
    const [cookies, setCookie] = useCookies(["PassBloggs", "userID"]);
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
        Logger.info("Updating register form", value);
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
        Logger.info("Form submitted", registerForm);

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
            const response = await UserService.registerUser(capitalizedForm);
            if (response.message) {
                showNotification(response.message, "success");

                const userData = response.user;
                if (userData) {
                    setCookie("PassBloggs", response.token, { path: "/", maxAge: 24 * 60 * 60 });
                    setCookie("userID", userData._id, { path: "/", maxAge: 24 * 60 * 60 });
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
        >
            <Modal.Header closeButton className="modal-header">
                <Modal.Title className="modal-title">REGISTER</Modal.Title>
            </Modal.Header>
            <Modal.Body className="modal-body">
                <Form onSubmit={handleRegister} className="register-form">
                    <div className="form-row">
                        <div className="form-column">
                            <InputField
                                label="First Name"
                                placeholder="Enter your first name"
                                value={registerForm.firstName}
                                onChange={(e) => updateRegisterForm({ firstName: e.target.value })}
                                error={errors.firstName}
                                className="register-modal-input"
                                ref={(el) => (inputRefs.current.firstName = el)}
                            />
                            <InputField
                                label="Email"
                                placeholder="Enter your email"
                                type="text"
                                value={registerForm.email}
                                onChange={(e) => updateRegisterForm({ email: e.target.value })}
                                error={errors.email}
                                className="register-modal-input"
                                ref={(el) => (inputRefs.current.email = el)}
                            />
                            <InputField
                                label="Birth Date"
                                type="date"
                                value={registerForm.birthDate}
                                onChange={(e) => updateRegisterForm({ birthDate: e.target.value })}
                                error={errors.birthDate}
                                className="register-modal-input"
                                ref={(el) => (inputRefs.current.birthDate = el)}
                            />
                        </div>

                        {/* Second Column */}
                        <div className="form-column">
                            <InputField
                                label="Last Name"
                                placeholder="Enter your last name"
                                value={registerForm.lastName}
                                onChange={(e) => updateRegisterForm({ lastName: e.target.value })}
                                error={errors.lastName}
                                className="register-modal-input"
                                ref={(el) => (inputRefs.current.lastName = el)}
                            />
                            <InputField
                                label="Password"
                                placeholder="Enter your password"
                                type="password"
                                value={registerForm.password}
                                onChange={(e) => updateRegisterForm({ password: e.target.value })}
                                error={errors.password}
                                className="register-modal-input"
                                ref={(el) => (inputRefs.current.password = el)}
                            />
                            <InputField
                                label="Confirm Password"
                                placeholder="Confirm your password"
                                type="password"
                                value={registerForm.confirmPassword}
                                onChange={(e) => updateRegisterForm({ confirmPassword: e.target.value })}
                                error={errors.confirmPassword}
                                className="register-modal-input"
                                ref={(el) => (inputRefs.current.confirmPassword = el)}
                            />
                            <InputField
                                label="Occupation"
                                placeholder="Enter your occupation"
                                value={registerForm.occupation}
                                onChange={(e) => updateRegisterForm({ occupation: e.target.value })}
                                error={errors.occupation}
                                className="register-modal-input"
                                ref={(el) => (inputRefs.current.occupation = el)}
                            />
                        </div>
                    </div>

                    {/* Third Row */}
                    <div className="form-row">
                        <SelectField
                            label="Location"
                            options={capitalCities}
                            value={registerForm.location}
                            onChange={(e) => updateRegisterForm({ location: e.target.value })}
                            error={errors.location}
                            className="register-modal-input"
                            ref={(el) => (inputRefs.current.location = el)}
                        />
                    </div>

                    <div className="submit-container">
                        <Button type="submit" className="button button-submit" disabled={loading}>
                            {loading ? "Submitting..." : "Register"}
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
}
