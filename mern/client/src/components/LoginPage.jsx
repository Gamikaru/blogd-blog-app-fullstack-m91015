// Import scss for styling
import "../styles/custom_component_styles/login_page.scss";
import React, { useState } from "react";
import Card from "react-bootstrap/Card";
import Toast from "react-bootstrap/Toast";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router";
import RegisterModal from "./RegisterModal"; // Import the modal component




// Export the LoginPage component
export default function LoginPage() {
	const [loginForm, setLoginForm] = useState({
		email: "",
		password: "",
	});

	const [cookie, setCookie, removeCookie] = useCookies();
	const navigate = useNavigate();
	const [showToast, setShowToast] = useState(false);
	const [showRegisterModal, setShowRegisterModal] = useState(false); // State to manage modal

	function updateLoginForm(value) {
		return setLoginForm((prev) => {
			return { ...prev, ...value };
		});
	}

	async function handleLogin(e) {
		e.preventDefault();
		if (!loginForm.email || !loginForm.password) {
			console.log("Login form is incomplete");
			return;
		}
		try {
			const response = await fetch("http://localhost:5050/user/login", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(loginForm),
			});
			if (!response.ok) {
				setShowToast(true);
				return;
			}
			const serverResponse = await response.json();
			setCookie("PassBloggs", serverResponse.token, { path: "/" });
			setCookie("userID", serverResponse.user.id, { path: "/" });
			setTimeout(() => {
				setLoginForm({ email: "", password: "" });
				navigate("/");
			}, 100);
		} catch (error) {
			console.error(error);
			navigate("/login");
		}
	}

	return (
		<>
			<div className="login-container">
				<img
					alt="CodeBloggs logo"
					className="logo-image"
					src="/assets/images/CodeBloggsLogo2.png"
				/>
				<Toast
					show={showToast}
					onClose={() => setShowToast(false)}
					className="login-toast-container"
					autohide
					delay={6000}
				>
					<Toast.Body className="login-toast-body">
						Failed Login Attempt: Invalid email or password
					</Toast.Body>
				</Toast>
				<div className="login-card-container">
					<Card className="login-card">
						<Card.Body>
							<h1 className="login-card-header">Welcome</h1>
							<form onSubmit={handleLogin}>
								<div className="login-input-container">
									<input
										type="text"
										id="login_email"
										placeholder="Email"
										value={loginForm.email}
										onChange={(e) =>
											updateLoginForm({ email: e.target.value })
										}
										required
										className="login-input-field"
									/>
								</div>
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
										className="login-input-field"
									/>
								</div>
								<div className="form-group">
									<input
										type="submit"
										value="LOGIN"
										className="btn btn-primary submit-btn"
									/>
								</div>
							</form>
							<div className="form-group">
								<span
									className="register-link"
									onClick={() => setShowRegisterModal(true)}
								>
									Not a member? Register Now!
								</span>
							</div>
						</Card.Body>
					</Card>
				</div>
			</div>
			<RegisterModal
				show={showRegisterModal}
				handleClose={() => setShowRegisterModal(false)}
			/>
		</>
	);
}
