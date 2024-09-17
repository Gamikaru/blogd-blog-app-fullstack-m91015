import React, { useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router";
import RegisterModal from "./RegisterModal";
import { Card, Toast } from "react-bootstrap";
import ApiClient from "../ApiClient"; // Import the ApiClient

export default function LoginPage() {
	const [loginForm, setLoginForm] = useState({
		email: "",
		password: "",
	});

	const [cookie, setCookie] = useCookies(["PassBloggs", "userID"]);
	const navigate = useNavigate();
	const [showToast, setShowToast] = useState(false);
	const [toastMessage, setToastMessage] = useState("");
	const [showRegisterModal, setShowRegisterModal] = useState(false);
	const [isButtonHovered, setIsButtonHovered] = useState(false);

	function updateLoginForm(value) {
		return setLoginForm((prev) => {
			return { ...prev, ...value };
		});
	}

	async function handleLogin(e) {
		e.preventDefault();

		// Check if the form is filled properly
		if (!loginForm.email || !loginForm.password) {
			console.log("Login form is incomplete");
			setToastMessage("Please fill in both email and password.");
			setShowToast(true);
			return;
		}

		try {
			// Use ApiClient for the POST request
			const response = await ApiClient.post("/user/login", loginForm);

			// If login fails (axios will automatically throw an error for non-200 responses)
			if (!response) {
				setToastMessage("Login failed. Please try again.");
				setShowToast(true);
				return;
			}

			// Log the token
			console.log("Server response token:", response.data.token);

			// Ensure token and userID are present in the response
			if (!response.data.token || !response.data.user.id) {
				setToastMessage("Invalid server response. Token or user ID missing.");
				setShowToast(true);
				return;
			}

			// Set cookies for token and user ID
			setCookie("PassBloggs", response.data.token, { path: "/", maxAge: 24 * 60 * 60 });
			setCookie("userID", response.data.user.id, { path: "/", maxAge: 24 * 60 * 60 });

			// Navigate to the homepage after a successful login
			setTimeout(() => {
				setLoginForm({ email: "", password: "" });
				navigate("/");
			}, 100);

		} catch (error) {
			// Handle any errors from the API call
			console.error("Login error:", error);
			setToastMessage("An error occurred during login. Please try again.");
			setShowToast(true);
		}
	}

	return (
		<>
			<div className="login-page">
				<div className="login-container d-flex flex-column justify-content-center align-items-center">
					{/* Logo Image */}
					<img
						alt="CodeBloggs logo"
						className="logo-image"
						src="/assets/images/invertedLogo.png"
					/>

					{/* Toast for failed login attempt */}
					{showToast && (
						<Toast
							onClose={() => setShowToast(false)}
							className="login-toast-container"
							autohide
							delay={6000}
						>
							<Toast.Body className="login-toast-body">
								{toastMessage}
							</Toast.Body>
						</Toast>
					)}

					{/* Login Card */}
					<div className="login-card-container w-100 d-flex justify-content-center">
						<Card className="login-card">
							<Card.Body>
								<h1 className="login-card-header">Welcome</h1>
								<form onSubmit={handleLogin}>
									{/* Email Input */}
									<div className="login-input-container">
										<input
											type="email"
											id="login_email"
											placeholder="Email"
											value={loginForm.email}
											onChange={(e) =>
												updateLoginForm({ email: e.target.value })
											}
											required
											className="login-input-field form-control"
										/>
									</div>

									{/* Password Input */}
									<div className="login-input-container">
										<input
											type="password"
											id="login_password"
											placeholder="Password"
											value={loginForm.password}
											onChange={(e) =>
												updateLoginForm({ password: e.target.value })
											}
											required
											className="login-input-field form-control"
										/>
									</div>

									{/* Submit Button */}
									<div className="login-submit-container">
										<input
											type="submit"
											value="LOGIN"
											className="submit-btn"
											onMouseEnter={() => setIsButtonHovered(true)}
											onMouseLeave={() => setIsButtonHovered(false)}
										/>
									</div>
								</form>

								{/* Register Link */}
								<div className="text-center">
									<span
										className="register-link"
										onClick={() => setShowRegisterModal(true)}
									>
										Not a member? <span>Register Now!</span>
									</span>
								</div>
							</Card.Body>
						</Card>
					</div>
				</div>
			</div>

			{/* Register Modal */}
			<RegisterModal
				show={showRegisterModal}
				handleClose={() => setShowRegisterModal(false)}
			/>
		</>
	);
}