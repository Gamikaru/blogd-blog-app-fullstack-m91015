import React, { useState } from "react";
import { Card, Toast } from "react-bootstrap";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router";
import ApiClient from "../../services/api/ApiClient";
import { usePublicModalContext } from "../../contexts/PublicModalContext"; // Import PublicModalContext
import Logger from "../../utils/Logger"; // Import Logger utility

export default function LoginPage() {
   const [loginForm, setLoginForm] = useState({
      email: "",
      password: "",
   });
   const [cookie, setCookie] = useCookies(["PassBloggs", "userID"]);
   const navigate = useNavigate();
   const [showToast, setShowToast] = useState(false); // State for showing toast notifications
   const [toastMessage, setToastMessage] = useState(""); // Message displayed in the toast
   const { togglePrivateModal } = usePublicModalContext(); // Use ModalContext to manage modals

   // Function to update the login form
   function updateLoginForm(value) {
      Logger.info("Updating login form", value);
      setLoginForm((prev) => ({ ...prev, ...value }));
   }

   // Function to handle login form submission
   async function handleLogin(e) {
      e.preventDefault();
      Logger.info("Login form submitted", loginForm);

      if (!loginForm.email || !loginForm.password) {
         setToastMessage("Please fill in both email and password.");
         setShowToast(true);
         Logger.warn("Login form validation failed: missing email or password");
         return;
      }

      try {
         const response = await ApiClient.post("/user/login", loginForm);
         Logger.info("API response received", response);

         if (!response || !response.data.token || !response.data.user._id) {
            setToastMessage("Login failed. Please try again.");
            setShowToast(true);
            Logger.error("Login failed: invalid response data", response);
            return;
         }

         setCookie("PassBloggs", response.data.token, { path: "/", maxAge: 24 * 60 * 60 });
         setCookie("userID", response.data.user._id, { path: "/", maxAge: 24 * 60 * 60 });
         Logger.info("Cookies set", { token: response.data.token, userID: response.data.user._id });

         setTimeout(() => {
            Logger.info("Reloading page after login");
            window.location.reload();
         }, 200);
      } catch (error) {
         setToastMessage("An error occurred during login. Please try again.");
         setShowToast(true);
         Logger.error("Login error", error);
      }
   }

   return (
      <>
         <div className="login-page">
            <div className="login-container d-flex flex-column justify-content-center align-items-center">
               <img alt="CodeBloggs logo" className="logo-image" src="/assets/images/invertedLogo.png" />

               {showToast && (
                  <Toast onClose={() => setShowToast(false)} className="login-toast-container" autohide delay={6000}>
                     <Toast.Body className="login-toast-body">{toastMessage}</Toast.Body>
                  </Toast>
               )}

               <div className="login-card-container w-100 d-flex justify-content-center">
                  <Card className="login-card">
                     <Card.Body>
                        <h1 className="login-card-header">Welcome</h1>
                        <form onSubmit={handleLogin}>
                           <div className="login-input-container">
                              <input
                                 type="email"
                                 id="login_email"
                                 placeholder="Email"
                                 value={loginForm.email}
                                 onChange={(e) => updateLoginForm({ email: e.target.value })}
                                 required
                                 className="login-input-field form-control"
                              />
                           </div>

                           <div className="login-input-container">
                              <input
                                 type="password"
                                 id="login_password"
                                 placeholder="Password"
                                 value={loginForm.password}
                                 onChange={(e) => updateLoginForm({ password: e.target.value })}
                                 required
                                 className="login-input-field form-control"
                              />
                           </div>

                           <div className="login-submit-container">
                              <input type="submit" value="LOGIN" className="submit-btn" />
                           </div>
                        </form>

                        {/* Register Link */}
                        <div className="text-center">
                           <span
                              className="register-link"
                              onClick={() => togglePublicModal('register')} // Trigger register modal
                           >
                              Not a member? <span>Register Now!</span>
                           </span>
                        </div>
                     </Card.Body>
                  </Card>
               </div>
            </div>
         </div>
      </>
   );
}