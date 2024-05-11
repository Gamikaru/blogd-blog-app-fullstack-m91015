import React, { useState } from "react";
import { useNavigate } from "react-router";
import Card from "react-bootstrap/Card";

export default function RegisterPage() {
	const [registerForm, setRegisterForm] = useState({
		first_name: "",
		last_name: "",
		email: "",
        password: "",
        birthdate: "",
        occupation: "",
        location: "",
	});
	const navigate = useNavigate();

	function updateRegisterForm(value) {
		return setRegisterForm((prev) => {
		return { ...prev, ...value };
		});
	}
	async function handleRegister(e) {
		e.preventDefault();

		if (!registerForm.email || !registerForm.password || !registerForm.birthdate || !registerForm.occupation || !registerForm.location) {
			window.alert("Please fill out all fields.");
			return;
		}
		try {
	const response = await fetch("http://localhost:5050/register/register/", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(registerForm),
	});
	    if (!response.ok) {
		throw new Error("Registration failed");
	}
	setRegisterForm({
		first_name: "",
		last_name: "",
		email: "",
        password: "",
        birthdate: "",
        occupation: "",
        location: "",
	});
		navigate("/");
	   }catch (error) {
		console.error(error);
	}
}
	return (
		<div className="register-container">
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
											onChange={(e) => updateRegisterForm({ first_name: e.target.value })}
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
											onChange={(e) => updateRegisterForm({ last_name: e.target.value })}
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
											onChange={(e) => updateRegisterForm({ birthdate: e.target.value })}
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
											onChange={(e) => updateRegisterForm({ occupation: e.target.value })}
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
