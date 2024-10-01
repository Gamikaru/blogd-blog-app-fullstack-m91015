import React, { useState } from "react";
import { Card } from "react-bootstrap"; // Remove Bootstrap Spinner
import { useCookies } from "react-cookie";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from 'react-router-dom'; // Import for navigation
import { useNotificationContext, usePublicModalContext, useUserUpdate } from "../../contexts";
import UserService from "../../services/api/UserService";
import Logger from "../../utils/Logger";
import { validateLoginForm } from '../../utils/formValidation';
import InputField from "../common/InputField";
import Spinner from "../common/Spinner"; // Import your custom spinner

export default function LoginPage() {
   const [loginForm, setLoginForm] = useState({
      email: "",
      password: "",
   });
   const [cookies, setCookie] = useCookies(["PassBloggs", "userID"]);
   const [loading, setLoading] = useState(false);  // Spinner state for page transitions
   const [showPassword, setShowPassword] = useState(false);
   const [errors, setErrors] = useState({});
   const [emailTouched, setEmailTouched] = useState(false);  // Track if email field has been touched
   const { showNotification, hideNotification } = useNotificationContext();  // Notification context
   const { togglePublicModal } = usePublicModalContext();
   const navigate = useNavigate(); // Use navigate hook for programmatic navigation
   const setUser = useUserUpdate();  // Hook for setting user

   // Update form state and track if email is being typed
   function updateLoginForm(value) {
      if (value.email !== undefined) {
         setEmailTouched(true);  // Set touched flag to true once the user types in the email field
      }
      const newForm = { ...loginForm, ...value };
      setLoginForm(newForm);
   }

   // Validate the field on blur and show error if email field was touched
   function handleBlur(fieldName) {
      if (fieldName === "email" && emailTouched) {
         const validationErrors = validateLoginForm(loginForm);
         const newErrors = { ...errors };

         // Show error only if the email is invalid after the user blurs the field
         if (validationErrors.email) {
            newErrors.email = validationErrors.email;
         } else {
            delete newErrors.email;
         }
         setErrors(newErrors);
      }
   }

   // Handle form submission
   async function handleLogin(e) {
      e.preventDefault(); // Prevent form default behavior

      Logger.info("Login form submitted", loginForm);

      const validationErrors = validateLoginForm(loginForm);

      if (Object.keys(validationErrors).length > 0) {
         setErrors(validationErrors);  // Show all errors upon form submission
         return;
      } else {
         setErrors({});
      }

      setLoading(true);  // Start the loading spinner during login process
      try {
         const response = await UserService.loginUser(loginForm);

         Logger.info("Login response received", response);

         // Check response validity
         if (!response || !response.token || !response.user || !response.user._id) {
            if (!response.user) {
               showNotification("No user found with this email.", "error");
            } else {
               showNotification("Incorrect password for this user.", "error");
            }
            Logger.error("Login failed: invalid response data", response);
            setLoading(false); // Stop loading spinner on failure
            return; // Prevent further execution on failure
         }

         // Set cookies but do not update the user state immediately
         setCookie("PassBloggs", response.token, { path: "/", maxAge: 24 * 60 * 60 });
         setCookie("userID", response.user._id, { path: "/", maxAge: 24 * 60 * 60 });
         Logger.info("Cookies set", { token: response.token, userID: response.user._id });

         // Delay setting the user state and redirection until the toast has been displayed
         setTimeout(() => {
            setUser(response.user); // Now update the user state
            hideNotification();  // Close the notification
            setLoading(false);    // Stop loading spinner
            navigate("/");        // Redirect to home page
         }, 2000);               // 2 seconds for success toast display

      } catch (error) {
         Logger.error("Login error", error);

         const errorMessage = error.message || "An error occurred during login. Please try again.";
         showNotification(errorMessage, "error");  // Display error message from backend
         setLoading(false);  // Stop loading spinner after error
      }
   }

   // If loading, display the spinner for page transition
   if (loading) {
      return <Spinner message="Logging you in..." />;  // Custom full-screen spinner
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
                           <InputField
                              label="Email"
                              value={loginForm.email}
                              onChange={(e) => updateLoginForm({ email: e.target.value })}
                              onBlur={() => handleBlur("email")} // Validate email on blur
                              placeholder="Enter your email"
                              className={`login-input-field ${errors.email ? "invalid-input" : ""}`}
                              error={errors.email}
                           />
                        </div>

                        <div className="login-input-container password-container">
                           <InputField
                              label="Password"
                              value={loginForm.password}
                              onChange={(e) => updateLoginForm({ password: e.target.value })}
                              placeholder="Enter your password"
                              type={showPassword ? "text" : "password"}
                              className={`login-input-field ${errors.password ? "invalid-input" : ""}`}
                              error={errors.password}
                           />
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
                           <button
                              type="submit"
                              disabled={loading}
                              className="submit-btn"
                           >
                              {loading ? "Logging in..." : "LOGIN"} {/* Text-only loading for the button */}
                           </button>
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
