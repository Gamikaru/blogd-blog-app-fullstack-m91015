// LoginPage.jsx
import React, { useState } from "react";
import { Card } from "react-bootstrap";
import { useCookies } from "react-cookie";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { useNotificationContext, usePublicModalContext, useUserUpdate } from "../../contexts";
import UserService from "../../services/api/UserService";
import Logger from "../../utils/Logger";
import { validateLoginForm } from '../../utils/formValidation';
import InputField from "../common/InputField";
import Spinner from "../common/Spinner";

export default function LoginPage() {
   const [loginForm, setLoginForm] = useState({
      email: "",
      password: "",
   });
   const [cookies, setCookie] = useCookies(["PassBloggs", "userID"]);
   const [loading, setLoading] = useState(false);
   const [showPassword, setShowPassword] = useState(false);
   const [errors, setErrors] = useState({});
   const [emailTouched, setEmailTouched] = useState(false);
   const { showNotification, hideNotification } = useNotificationContext();
   const { togglePublicModal } = usePublicModalContext();
   const navigate = useNavigate();
   const setUser = useUserUpdate();

   function updateLoginForm(value) {
      if (value.email !== undefined) {
         setEmailTouched(true);
      }
      const newForm = { ...loginForm, ...value };
      setLoginForm(newForm);
   }

   function handleBlur(fieldName) {
      if (fieldName === "email" && emailTouched) {
         const validationErrors = validateLoginForm(loginForm);
         const newErrors = { ...errors };

         if (validationErrors.email) {
            newErrors.email = validationErrors.email;
         } else {
            delete newErrors.email;
         }
         setErrors(newErrors);
      }
   }

   async function handleLogin(e) {
      e.preventDefault();

      Logger.info("Login form submitted", loginForm);

      const validationErrors = validateLoginForm(loginForm);

      if (Object.keys(validationErrors).length > 0) {
         setErrors(validationErrors);
         return;
      } else {
         setErrors({});
      }

      setLoading(true);
      try {
         const response = await UserService.loginUser(loginForm);

         Logger.info("Login response received", response);

         if (!response || !response.token || !response.user || !response.user._id) {
            if (!response.user) {
               showNotification("No user found with this email.", "error");
            } else {
               showNotification("Incorrect password for this user.", "error");
            }
            Logger.error("Login failed: invalid response data", response);
            setLoading(false);
            return;
         }

         setCookie("PassBloggs", response.token, { path: "/", maxAge: 24 * 60 * 60 });
         setCookie("userID", response.user._id, { path: "/", maxAge: 24 * 60 * 60 });
         Logger.info("Cookies set", { token: response.token, userID: response.user._id });

         setUser(response.user); // Update the user state immediately

         hideNotification();
         setLoading(false);
         navigate("/");

      } catch (error) {
         Logger.error("Login error", error);

         const errorMessage = error.message || "An error occurred during login. Please try again.";
         showNotification(errorMessage, "error");
         setLoading(false);
      }
   }

   if (loading) {
      return <Spinner message="Logging you in..." />;
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
                              onBlur={() => handleBlur("email")}
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
                              {loading ? "Logging in..." : "LOGIN"}
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
