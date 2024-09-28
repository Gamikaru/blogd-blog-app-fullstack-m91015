import React, { useState, useEffect } from "react";
import { Card, Spinner } from "react-bootstrap";
import { useCookies } from "react-cookie";
import { useNotificationContext } from "../../contexts/NotificationContext";
import UserService from "../../services/api/UserService";
import { InputField } from "../common"; // Updated to use InputField component
import { usePublicModalContext } from "../../contexts/PublicModalContext";
import Logger from "../../utils/Logger";
import { validateLoginForm } from '../../utils/formValidation';
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Import icons for password visibility toggle

export default function LoginPage() {
   const [loginForm, setLoginForm] = useState({
      email: "",
      password: "",
   });
   const [cookies, setCookie] = useCookies(["PassBloggs", "userID"]);
   const [loading, setLoading] = useState(false); // Loading state for form submission
   const [showPassword, setShowPassword] = useState(false); // For toggling password visibility
   const [errors, setErrors] = useState({}); // State to store validation errors

   const { showNotification, setPosition } = useNotificationContext();
   const { togglePublicModal } = usePublicModalContext();

   useEffect(() => {
      setPosition('info', false);
   }, [setPosition]);

   function updateLoginForm(value) {
      Logger.info("Updating login form", value);
      setLoginForm((prev) => ({ ...prev, ...value }));
   }

   async function handleLogin(e) {
      e.preventDefault();
      Logger.info("Login form submitted", loginForm);

      // Validate form
      const validationErrors = validateLoginForm(loginForm);

      // If validation errors exist, set the errors in state and prevent form submission
      if (Object.keys(validationErrors).length > 0) {
         setErrors(validationErrors); // Set inline errors
         return;
      } else {
         setErrors({}); // Clear errors if form is valid
      }

      setLoading(true); // Start loading
      try {
         const response = await UserService.loginUser(loginForm);
         if (!response || !response.token || !response.user._id) {
            // Show a toast notification if login failed due to incorrect credentials
            showNotification("Login failed. No user found with the provided credentials.", "error");
            Logger.error("Login failed: invalid response data", response);
            return;
         }

         // Set cookies and proceed with login success
         setCookie("PassBloggs", response.token, { path: "/", maxAge: 24 * 60 * 60 });
         setCookie("userID", response.user._id, { path: "/", maxAge: 24 * 60 * 60 });
         Logger.info("Cookies set", { token: response.token, userID: response.user._id });

         // Store token in localStorage for tests
         localStorage.setItem("authToken", response.token);

         showNotification("Login successful!", "success");
         setTimeout(() => {
            window.location.reload();
         }, 1000);

      } catch (error) {
         // Show a toast notification for any errors during login request
         showNotification("An error occurred during login. Please try again.", "error");
         Logger.error("Login error", error);
      } finally {
         setLoading(false); // End loading
      }
   }

   return (
      <div className="login-page">
         <div className="login-container d-flex flex-column justify-content-center align-items-center">
            <img alt="CodeBloggs logo" className="logo-image" src="/assets/images/invertedLogo.png" />

            <div className="login-card-container w-100 d-flex justify-content-center">
               <Card className="login-card">
                  <Card.Body>
                     <h1 className="login-card-header">Welcome</h1>
                     <form onSubmit={handleLogin}>
                        <div className="login-input-container">
                           {/* InputField for email */}
                           <InputField
                              label="Email"
                              value={loginForm.email}
                              onChange={(e) => updateLoginForm({ email: e.target.value })}
                              placeholder="Enter your email"
                              className={`login-input-field ${errors.email ? "invalid-input" : ""}`} // Highlight if invalid
                              error={errors.email} // Display email error
                           />
                        </div>

                        <div className="login-input-container password-container">
                           {/* InputField for password with a show/hide toggle */}
                           <InputField
                              label="Password"
                              value={loginForm.password}
                              onChange={(e) => updateLoginForm({ password: e.target.value })}
                              placeholder="Enter your password"
                              type={showPassword ? "text" : "password"}
                              className={`login-input-field ${errors.password ? "invalid-input" : ""}`} // Highlight if invalid
                              error={errors.password} // Display password error
                           />
                           {/* Password visibility toggle with eye icon */}
                           <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="password-toggle-btn"
                              aria-label="Toggle password visibility"
                           >
                              {showPassword ? <FaEye /> : <FaEyeSlash />}
                           </button>
                        </div>

                        <div className="login-submit-container">
                           <input
                              type="submit"
                              value={loading ? "Logging in..." : "LOGIN"}
                              disabled={loading}
                              className="submit-btn"
                           />
                           {loading && <Spinner animation="border" />}
                        </div>
                     </form>

                     <div className="text-center">
                        <p className="register-text">
                           Not yet registered?{" "}
                           <span
                              className="register-link"
                              onClick={() => togglePublicModal("register")}
                              aria-label="Sign up now!"
                           >
                              Sign up now!
                           </span>
                        </p>
                     </div>
                  </Card.Body>
               </Card>
            </div>
         </div>
      </div>
   );
}
