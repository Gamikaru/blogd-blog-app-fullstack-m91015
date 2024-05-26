import React, { useState } from "react";
import { useNavigate } from "react-router";
import Card from "react-bootstrap/Card";
import Toast from "react-bootstrap/Toast";

// Component for the registration page
export default function RegisterPage() {
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
	const [showToast, setShowToast] = useState(false);
	const navigate = useNavigate();

	function updateRegisterForm(value) {
		console.log("Updating form field:", value);
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
			setShowToast(true);
			return;
		}

		// if (!response.ok) {
		// 	const errorMessage = await response.text();
		// 	throw new Error(
		// 		`Server responded with status: ${response.status}. Message: ${errorMessage}`
		// 	);
		// }

		// If the response is successful, reset the form fields
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
		navigate("/login");
	} catch (error) {
		// Handle fetch error (e.g., network error, etc.)
		console.error("Error occurred during registration:", error.message);
		alert("Registration failed. " + error.message);
	}
}
	// Render the registration form
	return (
		<div className="register-container">
			<img
				alt="CodeBloggs logo"
				className="reg-logo-image"
				src="/CodeBloggs logo.png"
			/>
			<Toast
				show={showToast}
				onClose={() => setShowToast(false)}
				className="reg-toast-container"
				autohide
				delay={6000}
			>
				<Toast.Header className="red-toast-header">
					<strong className="me-auto">Registration Error</strong>
				</Toast.Header>
				<Toast.Body className="reg-toast-body">
					Invalid registration attempt or user already exists.
				</Toast.Body>
			</Toast>
			<div className="register-card-container">
				<Card>
					<Card.Body>
						<h1 className="card-header">Registration</h1>
						<form onSubmit={handleRegister}>
							<div className="register-input-container">
								<div className="register-input-column">
									<div className="register-input-container">
										<label htmlFor="register_first_name"></label>
										<input
											type="text"
											placeholder="First Name"
											id="register_first_name"
											value={registerForm.first_name}
											onChange={(e) =>
												updateRegisterForm({ first_name: e.target.value })
											}
											required
										/>
									</div>
									<div className="register-input-container">
										<label htmlFor="register_email"></label>
										<input
											type="text"
											placeholder="Email"
											id="register_email"
											value={registerForm.email}
											onChange={(e) =>
												updateRegisterForm({ email: e.target.value })
											}
											required
										/>
									</div>
									<div className="register-input-container">
										<label htmlFor="register_password"></label>
										<input
											type="password"
											placeholder="Password"
											id="register_password"
											value={registerForm.password}
											onChange={(e) =>
												updateRegisterForm({ password: e.target.value })
											}
											required
										/>
									</div>
									<div className="register-input-container">
										<label htmlFor="register_location"></label>
										<input
											type="text"
											placeholder="Location"
											id="register_location"
											value={registerForm.location}
											onChange={(e) =>
												updateRegisterForm({ location: e.target.value })
											}
											required
										/>
									</div>
								</div>
								<div className="register-input-column">
									<div className="register-input-container">
										<label htmlFor="register_last_name"></label>
										<input
											type="text"
											placeholder="Last Name"
											id="register_last_name"
											value={registerForm.last_name}
											onChange={(e) =>
												updateRegisterForm({ last_name: e.target.value })
											}
											required
										/>
									</div>
									<div className="register-input-container">
										<label htmlFor="register_birthdate"></label>
										<input
											type="date"
											placeholder="Birthdate"
											id="register_birthdate"
											value={registerForm.birthdate}
											onChange={(e) =>
												updateRegisterForm({ birthdate: e.target.value })
											}
											required
										/>
									</div>
									<div className="register-input-container">
										<label htmlFor="register_occupation"></label>
										<input
											type="text"
											placeholder="Occupation"
											id="register_occupation"
											value={registerForm.occupation}
											onChange={(e) =>
												updateRegisterForm({ occupation: e.target.value })
											}
											required
										/>
									</div>
									<div className="register-input-container">
										<label htmlFor="register_status"></label>
										<input
											type="text"
											placeholder="Status"
											id="register_status"
											value={registerForm.status}
											onChange={(e) =>
												updateRegisterForm({ status: e.target.value })
											}
											required
										/>
									</div>
								</div>
							</div>
							<div className="register-form-group">
								<input
									type="submit"
									value="Submit"
									className="btn btn-primary"
								/>
							</div>
						</form>
					</Card.Body>
				</Card>
			</div>
		</div>
	);
}
