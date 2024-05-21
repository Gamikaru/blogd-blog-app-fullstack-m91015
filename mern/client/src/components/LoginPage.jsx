import React, { useState } from "react";
import { Card, Toast } from "react-bootstrap";
import { useNavigate } from "react-router";
import { useCookies } from "react-cookie";

function LoginForm({ handleLogin, loginForm, updateLoginForm, showToast, setShowToast,})
{
	return (
		<div className="container">
			<img
				alt="CodeBloggs logo"
				className="logo-image"
				src="/CodeBloggs logo.png"
			/>
			<div className="card-container">
				<Card>
					<Card.Body>
						<h1 className="card-header">Login</h1>
						<form onSubmit={handleLogin}>
							<div className="input-container">
								<input
									type="text"
									id="login_email"
									placeholder="Email"
									value={loginForm.email}
									onChange={(e) => updateLoginForm({ email: e.target.value })}
									required
								/>
								<label htmlFor="login_email"></label>
							</div>
							<div className="input-container">
								<input
									type="password"
									id="login_password"
									placeholder="Password"
									value={loginForm.password}
									onChange={(e) =>
										updateLoginForm({ password: e.target.value })
									}
									required
								/>
								<label htmlFor="login_password"></label>
							</div>
							<div className="form-group">
								<input
									type="submit"
									value="Submit"
									className="btn btn-primary"
								/>
							</div>
						</form>
						<div className="form-group">
							<a href="/register" className="register-link">
								<p>Not a member? Register Now!</p>
							</a>
						</div>
					</Card.Body>
				</Card>
			</div>
			<Toast
				show={showToast}
				onClose={() => setShowToast(false)}
				className="toast-container"
				autohide
				delay={3000}
			>
				<Toast.Header>
					<strong className="me-auto">Failed Login Attempt</strong>
				</Toast.Header>
				<Toast.Body className="toast-body">
					Invalid email or password.
				</Toast.Body>
			</Toast>
		</div>
	);
}
export default function LoginPage() {
	const [loginForm, setLoginForm] = useState({
		email: "",
		password: "",
	});

	const [showToast, setShowToast] = useState(false);

	const [cookie, setCookie, removeCookie] = useCookies();

	const navigate = useNavigate();

	function updateLoginForm(value) {
		setLoginForm((prev) => {
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
			const response = await fetch("http://localhost:5050/login", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(loginForm),
			});
			if (!response.ok) {
				setShowToast(true);
				return;
			}
			const serverResponse = await response.json();
			console.log(serverResponse);
			console.log("Login successful");
			setLoginForm({ email: "", password: "" });
			navigate("/home");
		} catch (error) {
			console.error(error);
			navigate("/");
			console.log("Login failed:", error.message);
		}
	}

	return (
		<LoginForm
			handleLogin={handleLogin}
			loginForm={loginForm}
			updateLoginForm={updateLoginForm}
			showToast={showToast}
			setShowToast={setShowToast}
		/>
	);
}
