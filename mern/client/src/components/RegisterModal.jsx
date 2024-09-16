import React, { useState } from "react";
import Card from "react-bootstrap/Card";
import Modal from "react-bootstrap/Modal";
import Toast from "react-bootstrap/Toast";
import { useNavigate } from "react-router";



export default function RegisterModal({ show, handleClose }) {
    const [registerForm, setRegisterForm] = useState({
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        birthdate: "",
        occupation: "",
        location: "",
        status: "",
        auth_level: "",
    });

    const [showSuccessToast, setShowSuccessToast] = useState(false);
    const [showErrorToast, setShowErrorToast] = useState(false);
    const navigate = useNavigate();

    function updateRegisterForm(value) {
        setRegisterForm((prev) => ({ ...prev, ...value }));
    }

    async function handleRegister(e) {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:5050/user/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(registerForm),
            });
            if (!response.ok) {
                setShowErrorToast(true);
                return;
            }

            // Reset form and show success toast
            setRegisterForm({
                first_name: "",
                last_name: "",
                email: "",
                password: "",
                birthdate: "",
                occupation: "",
                location: "",
                status: "",
                auth_level: "",
            });
            setShowSuccessToast(true);
            navigate("/login");
        } catch (error) {
            console.error("Error during registration:", error.message);
            alert("Registration failed. " + error.message);
        }
    }

    return (
        <>
            <Modal show={show} onHide={handleClose} centered className="register-modal-container">
                <Modal.Header closeButton className="register-modal-header">
                    <Modal.Title className="modal-title">Register</Modal.Title>
                </Modal.Header>
                <Modal.Body className="register-modal-body">
                    <Toast
                        show={showSuccessToast}
                        onClose={() => setShowSuccessToast(false)}
                        className="register-toast register-toast-success"
                        autohide
                        delay={6000}
                    >
                        <Toast.Body className="register-toast-body-success">
                            Successful registration!
                        </Toast.Body>
                    </Toast>
                    <Toast
                        show={showErrorToast}
                        onClose={() => setShowErrorToast(false)}
                        className="register-toast register-toast-error"
                        autohide
                        delay={6000}
                    >
                        <Toast.Body className="register-toast-body-error">
                            Invalid registration attempt or user already exists.
                        </Toast.Body>
                    </Toast>

                    <Card className="register-card">
                        <Card.Body>
                            <form onSubmit={handleRegister} className="register-form">
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <input
                                            type="text"
                                            placeholder="First Name"
                                            id="register_first_name"
                                            value={registerForm.first_name}
                                            onChange={(e) =>
                                                updateRegisterForm({
                                                    first_name: e.target.value,
                                                })
                                            }
                                            required
                                            className="register-modal-input"
                                        />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <input
                                            type="text"
                                            placeholder="Last Name"
                                            id="register_last_name"
                                            value={registerForm.last_name}
                                            onChange={(e) =>
                                                updateRegisterForm({
                                                    last_name: e.target.value,
                                                })
                                            }
                                            required
                                            className="register-modal-input"
                                        />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <input
                                            type="email"
                                            placeholder="Email"
                                            id="register_email"
                                            value={registerForm.email}
                                            onChange={(e) =>
                                                updateRegisterForm({
                                                    email: e.target.value,
                                                })
                                            }
                                            required
                                            className="register-modal-input"
                                        />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <input
                                            type="password"
                                            placeholder="Password"
                                            id="register_password"
                                            value={registerForm.password}
                                            onChange={(e) =>
                                                updateRegisterForm({
                                                    password: e.target.value,
                                                })
                                            }
                                            required
                                            className="register-modal-input"
                                        />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <input
                                            type="date"
                                            id="register_birthdate"
                                            value={registerForm.birthdate}
                                            onChange={(e) =>
                                                updateRegisterForm({
                                                    birthdate: e.target.value,
                                                })
                                            }
                                            required
                                            className="register-modal-input"
                                        />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <input
                                            type="text"
                                            placeholder="Occupation"
                                            id="register_occupation"
                                            value={registerForm.occupation}
                                            onChange={(e) =>
                                                updateRegisterForm({
                                                    occupation: e.target.value,
                                                })
                                            }
                                            required
                                            className="register-modal-input"
                                        />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <input
                                            type="text"
                                            placeholder="Location"
                                            id="register_location"
                                            value={registerForm.location}
                                            onChange={(e) =>
                                                updateRegisterForm({
                                                    location: e.target.value,
                                                })
                                            }
                                            required
                                            className="register-modal-input"
                                        />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <input
                                            type="text"
                                            placeholder="Status"
                                            id="register_status"
                                            value={registerForm.status}
                                            onChange={(e) =>
                                                updateRegisterForm({
                                                    status: e.target.value,
                                                })
                                            }
                                            required
                                            className="register-modal-input"
                                        />
                                    </div>
                                </div>
                                <button type="submit" className="register-submit-btn w-100">
                                    Submit
                                </button>
                            </form>
                        </Card.Body>
                    </Card>
                </Modal.Body>
            </Modal>
        </>
    );
}
