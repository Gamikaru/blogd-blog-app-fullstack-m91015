import React, { useState } from "react";
import { useNavigate } from "react-router";
import Card from "react-bootstrap/Card";


export default function LoginPage() {
	const [loginForm, setLoginForm] = useState({
		email: "",
		password: "",
	});

	const navigate = useNavigate();

	function updateLoginForm(value) {
		return setLoginForm((prev) => {
			return { ...prev, ...value };
		});
	}

	async function handleLogin(e) {
		e.preventDefault();

		console.log("Login form data:", loginForm);

		if (!loginForm.email || !loginForm.password) {
			console.log("Login form is incomplete");
			return;
		}

		try {
			const response = await fetch("http://localhost:5050/login/login", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(loginForm),
			});

			if (!response.ok) {
				throw new Error("Login failed");
			}

			console.log("Login successful");
			setLoginForm({ email: "", password: "" });

			navigate("/");
		} catch (error) {
			console.error(error);
			navigate("/");
			console.log("Login failed:", error.message);
		}
	}
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

