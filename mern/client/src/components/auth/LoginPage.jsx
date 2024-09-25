import React, { useState } from "react";
import { Card } from "react-bootstrap";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router";
import { useNotificationContext } from "../../contexts/NotificationContext"; // Use NotificationContext
import UserService from "../../services/api/UserService"; // Import UserService
import InputField from "../common/InputField"; // Use InputField component
import { usePublicModalContext } from "../../contexts/PublicModalContext";
import Logger from "../../utils/Logger";
import { validateLoginForm } from '../../utils/formValidation'; // Import the validation helper

export default function LoginPage() {
   const [loginForm, setLoginForm] = useState({
      email: "",
      password: "",
   });
   const [cookie, setCookie] = useCookies(["PassBloggs", "userID"]);
   const navigate = useNavigate();
   const { showNotification } = useNotificationContext(); // Use Notification Context
   const { togglePublicModal } = usePublicModalContext();

   function updateLoginForm(value) {
      Logger.info("Updating login form", value);
      setLoginForm((prev) => ({ ...prev, ...value }));
   }

   async function handleLogin(e) {
      e.preventDefault();
      Logger.info("Login form submitted", loginForm);

      // Use validateLoginForm to check the inputs
      const errors = validateLoginForm(loginForm);
      if (Object.keys(errors).length > 0) {
         showNotification(Object.values(errors).join(', '), 'error');
         Logger.warn("Login form validation failed", errors);
         return;
      }

      try {
         const response = await UserService.loginUser(loginForm); // Use UserService

         if (!response || !response.token || !response.user._id) {
            showNotification("Login failed. Please try again.", "error");
            Logger.error("Login failed: invalid response data", response);
            return;
         }

         // Set cookies for the user token and user ID
         setCookie("PassBloggs", response.token, { path: "/", maxAge: 24 * 60 * 60 });
         setCookie("userID", response.user._id, { path: "/", maxAge: 24 * 60 * 60 });
         Logger.info("Cookies set", { token: response.token, userID: response.user._id });

         setTimeout(() => {
            navigate('/'); // Redirect to home after login
         }, 200);
      } catch (error) {
         showNotification("An error occurred during login. Please try again.", "error");
         Logger.error("Login error", error);
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
                           <InputField
                              type="email"
                              label="Email"
                              value={loginForm.email}
                              onChange={(e) => updateLoginForm({ email: e.target.value })}
                              required
                           />
                        </div>

                        <div className="login-input-container">
                           <InputField
                              type="password"
                              label="Password"
                              value={loginForm.password}
                              onChange={(e) => updateLoginForm({ password: e.target.value })}
                              required
                           />
                        </div>

                        <div className="login-submit-container">
                           <input type="submit" value="LOGIN" className="submit-btn" />
                        </div>
                     </form>

                     <div className="text-center">
                        <span
                           className="register-link"
                           onClick={() => togglePublicModal('register')}
                        >
                           Not a member? <span>Register Now!</span>
                        </span>
                     </div>
                  </Card.Body>
               </Card>
            </div>
         </div>
      </div>
   );
}
