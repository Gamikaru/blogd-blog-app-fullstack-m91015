import React, { useState } from "react";
import { useNavigate } from "react-router";
import Card from "react-bootstrap/Card";

// Export the LoginPage component
export default function LoginPage() {
	// Initialize the loginForm state with an empty email and password
	const [loginForm, setLoginForm] = useState({
		email: "",
		password: "",
	});
	// Initialize the navigate function using the useNavigate hook
	const navigate = useNavigate();
	// Define the updateLoginForm function to update the loginForm state
	function updateLoginForm(value) {
		return setLoginForm((prev) => {
			return { ...prev, ...value };
		});
	}
	// Define the handleLogin function to handle the form submission
	async function handleLogin(e) {
		e.preventDefault();
		// Log the login form data to the console
		console.log("Login form data:", loginForm);
		// Check if the email and password fields are not empty
		if (!loginForm.email || !loginForm.password) {
			// Log an error message to the console if the form is incomplete
			console.log("Login form is incomplete");
			return;
		}
		try {
			// Send a POST request to the /login/login endpoint with the loginForm data
			const response = await fetch("http://localhost:5050/login/login", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(loginForm),
			});
			// Check if the response is not ok
			if (!response.ok) {
				// Throw an error if the login failed
				throw new Error("Login failed");
			}
			// Log a success message to the console if the login was successful
			console.log("Login successful");
			// Reset the loginForm state
			setLoginForm({ email: "", password: "" });
			// Navigate to the root route
			navigate("/");
		} catch (error) {
			// Log the error message to the console if the login failed
			console.error(error);
			navigate("/");
			console.log("Login failed:", error.message);
		}
	}
	// Return the JSX for the login form
	return (
		<Card>
			<Card.Body>
				<h1>Welcome to CodeBloggs Please Login!</h1>
				<form onSubmit={handleLogin}>
					<div className="form-group col-md-3">
						<label htmlFor="login_email">Email:</label>
						<input
							type="text"
							className="form-control"
							id="login_email"
							value={loginForm.email}
							onChange={(e) => updateLoginForm({ email: e.target.value })}
							required
						/>
					</div>
					<div className="form-group  col-md-3">
						<label htmlFor="login_password">Password:</label>
						<input
							type="password"
							className="form-control"
							id="login_password"
							value={loginForm.password}
							onChange={(e) => updateLoginForm({ password: e.target.value })}
							required
						/>
					</div>
					<div className="form-group">
						<input type="submit" value="Login" className="btn btn-primary" />
					</div>
				</form>
			</Card.Body>
		</Card>
	);
}

