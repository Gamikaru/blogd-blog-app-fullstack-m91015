import React, { useState } from "react";
import { Card } from "react-bootstrap";
import { useNavigate } from "react-router";

// Component for rendering the registration form
function RegisterForm({ registerForm, updateRegisterForm, handleRegister }) {
	return (
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
							onChange={(e) => updateRegisterForm({ email: e.target.value })}
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
							onChange={(e) => updateRegisterForm({ password: e.target.value })}
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
							onChange={(e) => updateRegisterForm({ location: e.target.value })}
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
							onChange={(e) => updateRegisterForm({ status: e.target.value })}
							required
						/>
					</div>
				</div>
			</div>
			<div className="register-form-group">
				<input type="submit" value="Submit" className="btn btn-primary" />
			</div>
		</form>
	);
}

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

	const navigate = useNavigate();

	function updateRegisterForm(value) {
		setRegisterForm((prev) => ({ ...prev, ...value }));
	}

	async function handleRegister(e) {
		e.preventDefault();

		try {
			const response = await fetch("http://localhost:5050/register", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(registerForm),
			});

			if (!response.ok) {
				const errorMessage = await response.text();
				throw new Error(
					`Server responded with status: ${response.status}. Message: ${errorMessage}`
				);
			}

			// Reset form after successful registration
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
			console.error("Error occurred during registration:", error.message);
			alert("Registration failed. " + error.message);
		}
	}

	return (
		<div className="register-container">
			<img
				alt="CodeBloggs logo"
				className="reg-logo-image"
				src="/CodeBloggs logo.png"
			/>
			<div className="register-card-container">
				<Card>
					<Card.Body>
						<h1 className="card-header">Registration</h1>
						<RegisterForm
							registerForm={registerForm}
							updateRegisterForm={updateRegisterForm}
							handleRegister={handleRegister}
						/>
					</Card.Body>
				</Card>
			</div>
		</div>
	);
}
