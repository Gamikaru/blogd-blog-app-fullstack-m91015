import React, { useState } from "react";
import { Card, Toast } from "react-bootstrap";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router";
import ApiClient from "../../services/api/ApiClient";
import RegisterModal from "../modals/RegisterModal";

export default function LoginPage() {
   const [loginForm, setLoginForm] = useState({
      email: "",
      password: "",
   });

   const [cookie, setCookie] = useCookies(["PassBloggs", "userID"]);
   const navigate = useNavigate();
   const [showToast, setShowToast] = useState(false); // State for showing toast notifications
   const [toastMessage, setToastMessage] = useState(""); // Message displayed in the toast
   const [showRegisterModal, setShowRegisterModal] = useState(false); // State for showing the register modal
   const [isButtonHovered, setIsButtonHovered] = useState(false); // State to handle button hover effect

   /**
    * updateLoginForm: Updates the login form state dynamically based on the input field.
    */
   function updateLoginForm(value) {
      console.log("Updating login form with value:", value); // Debugging log
      return setLoginForm((prev) => {
         const updatedForm = { ...prev, ...value };
         console.log("Updated login form state:", updatedForm); // Debugging log
         return updatedForm;
      });
   }

   /**
    * handleLogin: Handles the login process by making a POST request to the API.
    * @param {Event} e - Form submission event.
    */
   async function handleLogin(e) {
      e.preventDefault();
      console.log("Login form submitted with values:", loginForm); // Debugging log

      // Validate the form input
      if (!loginForm.email || !loginForm.password) {
         console.log("Login form is incomplete"); // Debugging log
         setToastMessage("Please fill in both email and password.");
         setShowToast(true);
         return;
      }

      try {
         // Send login request via the ApiClient
         console.log("Sending login request to API with data:", loginForm); // Debugging log
         const response = await ApiClient.post("/user/login", loginForm);

         if (!response) {
            console.log("Login failed, no response received"); // Debugging log
            setToastMessage("Login failed. Please try again.");
            setShowToast(true);
            return;
         }

         // Check if the response contains the required token and user ID
         if (!response.data.token || !response.data.user._id) {
            console.log("Invalid server response. Token or user ID missing."); // Debugging log
            setToastMessage("Invalid server response. Token or user ID missing.");
            setShowToast(true);
            return;
         }

         // Set cookies for token and user ID
         console.log("Setting cookies for token and user ID"); // Debugging log
         setCookie("PassBloggs", response.data.token, { path: "/", maxAge: 24 * 60 * 60 });
         setCookie("userID", response.data.user._id, { path: "/", maxAge: 24 * 60 * 60 });

         // Reload the page to reflect the new login state
         setTimeout(() => {
            console.log("Login successful, reloading page"); // Debugging log
            window.location.reload();
         }, 200);

      } catch (error) {
         // Handle any errors from the API call
         console.error("Login error:", error); // Debugging log
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
                                 onChange={(e) => updateLoginForm({ email: e.target.value })}
                                 required
                                 className="login-input-field form-control"
                                 autoComplete="username" // Add autocomplete attribute for better UX
                              />
                           </div>

                           {/* Password Input */}
                           <div className="login-input-container">
                              <input
                                 type="password"
                                 id="login_password"
                                 placeholder="Password"
                                 value={loginForm.password}
                                 onChange={(e) => updateLoginForm({ password: e.target.value })}
                                 required
                                 className="login-input-field form-control"
                                 autoComplete="current-password" // Add autocomplete attribute for better UX
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
