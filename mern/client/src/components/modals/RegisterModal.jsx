import React, { useState } from "react";
import { Modal, Card, Toast } from "react-bootstrap"; // Import Modal, Card, and Toast components from react-bootstrap
import ApiClient from "../../services/api/ApiClient";
import { useUserUpdate, usePublicModalContext } from "../../contexts"; // Import useUserUpdate and useModalContext hooks
import { useCookies } from "react-cookie"; // Import for managing cookies
import Logger from "../../utils/Logger"; // Import Logger utility


export default function RegisterModal() {
   const [registerForm, setRegisterForm] = useState({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      birthDate: "",
      occupation: "",
      location: "",
      status: "", // Optional field, can be handled with default
      authLevel: "basic", // Default auth level
   });

   const [showErrorToast, setShowErrorToast] = useState(false);
   const [showSuccessToast, setShowSuccessToast] = useState(false);
   const [toastMessage, setToastMessage] = useState("");
   const [loading, setLoading] = useState(false); // Loading state
   const [errors, setErrors] = useState({}); // Error state for form validation
   const setUser = useUserUpdate(); // Get setUser from UserContext
   const [cookies, setCookie] = useCookies(["PassBloggs", "userID"]); // Use cookies for token management
   const { showModal, togglePublicModal } = usePublicModalContext(); // Use public modal context

   // Add a console log to debug modal visibility and type
   Logger.info("RegisterModal - showModal:", showModal, "modalType:", modalType);

   // Function to update the registration form state
   function updateRegisterForm(value) {
      Logger.info("Updating register form", value);
      setRegisterForm((prev) => ({ ...prev, ...value }));
   }

   // Function to capitalize the first letter of a string
   function capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
   }

   // Function to validate the form
   function validateForm() {
      const newErrors = {};
      if (!registerForm.firstName) newErrors.firstName = "First name is required";
      if (!registerForm.lastName) newErrors.lastName = "Last name is required";
      if (!registerForm.email) newErrors.email = "Email is required";
      if (!registerForm.password) newErrors.password = "Password is required";
      if (!registerForm.birthDate) newErrors.birthDate = "Birth date is required";
      if (!registerForm.occupation) newErrors.occupation = "Occupation is required";
      if (!registerForm.location) newErrors.location = "Location is required";
      setErrors(newErrors);
      Logger.info("Form validation errors", newErrors);
      return Object.keys(newErrors).length === 0;
   }

   // Function to handle form submission
   async function handleRegister(e) {
      e.preventDefault();
      Logger.info("Form submitted", registerForm);

      if (!validateForm()) {
         setToastMessage("Please fill out all required fields.");
         setShowErrorToast(true);
         Logger.warn("Form validation failed");
         return;
      }

      // Capitalize first and last names and occupation before sending to the API
      const capitalizedForm = {
         ...registerForm,
         firstName: capitalizeFirstLetter(registerForm.firstName),
         lastName: capitalizeFirstLetter(registerForm.lastName),
         occupation: capitalizeFirstLetter(registerForm.occupation),
         email: registerForm.email.toLowerCase(), // Transform email to lowercase
      };

      setLoading(true); // Set loading state
      Logger.info("Sending registration data to API", capitalizedForm);

      try {
         const response = await ApiClient.post("/user/register", capitalizedForm);
         Logger.info("API response received", response);

         if (response.status !== 201) {
            setToastMessage("Registration failed. Please try again.");
            setShowErrorToast(true);
            Logger.error("Registration failed with status", response.status);
            return;
         }

         const userData = response.data?.user;
         if (userData) {
            // Set cookies for the token and userID for auto-login
            setCookie("PassBloggs", response.data.token, { path: "/", maxAge: 24 * 60 * 60 });
            setCookie("userID", userData._id, { path: "/", maxAge: 24 * 60 * 60 });

            setUser(userData); // Set user in UserContext
            setToastMessage("Registration successful!");
            setShowSuccessToast(true);
            Logger.info("Registration successful, user data set", userData);

            // Close the modal after successful registration
            togglePublicModal();
         }

         // Reset form after successful registration
         setRegisterForm({
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            birthDate: "",
            occupation: "",
            location: "",
            status: "",
            authLevel: "basic",
         });
      } catch (error) {
         setToastMessage("Registration failed. Please try again.");
         setShowErrorToast(true);
         Logger.error("Registration failed with error", error);
      } finally {
         setLoading(false); // Reset loading state
         Logger.info("Loading state reset");
      }
   }

   const capitalCities = [
      "Washington, D.C.", "Ottawa", "Mexico City", "London", "Paris", "Berlin", "Rome", "Madrid", "Tokyo", "Beijing",
      "Canberra", "Brasília", "Moscow", "New Delhi", "Cairo", "Buenos Aires", "Ankara", "Seoul", "Bangkok", "Jakarta"
   ];

   return (
      <>
         {/* Error Toast */}
         <Toast
            show={showErrorToast}
            onClose={() => setShowErrorToast(false)}
            className="register-toast register-toast-error"
            autohide
            delay={6000}
         >
            <Toast.Body className="register-toast-body-error">
               {toastMessage}
            </Toast.Body>
         </Toast>

         {/* Success Toast */}
         <Toast
            show={showSuccessToast}
            onClose={() => setShowSuccessToast(false)}
            className="register-toast register-toast-success"
            autohide
            delay={6000}
         >
            <Toast.Body className="register-toast-body-success">
               {toastMessage}
            </Toast.Body>
         </Toast>

         {/* Modal */}
         <Modal
            show={showModal}
            onHide={togglePublicModal}
            centered
            className="register-modal-container"
            style={{ visibility: 'visible', display: 'block', zIndex: 3000 }}
         >
            <Modal.Header closeButton className="register-modal-header">
               <Modal.Title className="modal-title">Register</Modal.Title>
            </Modal.Header>
            <Modal.Body className="register-modal-body">
               <Card className="register-card">
                  <Card.Body>
                     <form onSubmit={handleRegister} className="register-form">
                        <div className="row">
                           <div className="col-md-6 mb-3">
                              <input
                                 type="text"
                                 placeholder="First Name"
                                 id="register_first_name"
                                 value={registerForm.firstName}
                                 onChange={(e) => updateRegisterForm({ firstName: e.target.value })}
                                 required
                                 className={`register-modal-input ${errors.firstName ? 'is-invalid' : ''}`}
                              />
                              {errors.firstName && <div className="invalid-feedback">{errors.firstName}</div>}
                           </div>
                           <div className="col-md-6 mb-3">
                              <input
                                 type="text"
                                 placeholder="Last Name"
                                 id="register_last_name"
                                 value={registerForm.lastName}
                                 onChange={(e) => updateRegisterForm({ lastName: e.target.value })}
                                 required
                                 className={`register-modal-input ${errors.lastName ? 'is-invalid' : ''}`}
                              />
                              {errors.lastName && <div className="invalid-feedback">{errors.lastName}</div>}
                           </div>
                        </div>

                        <div className="row">
                           <div className="col-md-6 mb-3">
                              <input
                                 type="email"
                                 placeholder="Email"
                                 id="register_email"
                                 value={registerForm.email}
                                 onChange={(e) => updateRegisterForm({ email: e.target.value })}
                                 required
                                 className={`register-modal-input ${errors.email ? 'is-invalid' : ''}`}
                              />
                              {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                           </div>
                           <div className="col-md-6 mb-3">
                              <input
                                 type="password"
                                 placeholder="Password"
                                 id="register_password"
                                 value={registerForm.password}
                                 onChange={(e) => updateRegisterForm({ password: e.target.value })}
                                 required
                                 className={`register-modal-input ${errors.password ? 'is-invalid' : ''}`}
                                 autoComplete="current-password"
                              />
                              {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                           </div>
                        </div>

                        <div className="row">
                           <div className="col-md-6 mb-3">
                              <input
                                 type="date"
                                 id="register_birthdate"
                                 value={registerForm.birthDate}
                                 onChange={(e) => updateRegisterForm({ birthDate: e.target.value })}
                                 required
                                 className={`register-modal-input ${errors.birthDate ? 'is-invalid' : ''}`}
                              />
                              {errors.birthDate && <div className="invalid-feedback">{errors.birthDate}</div>}
                           </div>
                           <div className="col-md-6 mb-3">
                              <input
                                 type="text"
                                 placeholder="Occupation"
                                 id="register_occupation"
                                 value={registerForm.occupation}
                                 onChange={(e) => updateRegisterForm({ occupation: e.target.value })}
                                 required
                                 className={`register-modal-input ${errors.occupation ? 'is-invalid' : ''}`}
                              />
                              {errors.occupation && <div className="invalid-feedback">{errors.occupation}</div>}
                           </div>
                        </div>

                        <div className="row">
                           <div className="col-md-6 mb-3">
                              <select
                                 id="register_location"
                                 value={registerForm.location}
                                 onChange={(e) => updateRegisterForm({ location: e.target.value })}
                                 required
                                 className={`register-modal-input ${errors.location ? 'is-invalid' : ''}`}
                              >
                                 <option value="">Select Location</option>
                                 {capitalCities.map((city) => (
                                    <option key={city} value={city}>
                                       {city}
                                    </option>
                                 ))}
                              </select>
                              {errors.location && <div className="invalid-feedback">{errors.location}</div>}
                           </div>
                           <div className="col-md-6 mb-3">
                              <input
                                 type="text"
                                 placeholder="Status"
                                 id="register_status"
                                 value={registerForm.status}
                                 onChange={(e) => updateRegisterForm({ status: e.target.value })}
                                 className="register-modal-input"
                              />
                           </div>
                        </div>

                        <button type="submit" className="register-submit-btn w-100" disabled={loading}>
                           {loading ? "Submitting..." : "Submit"}
                        </button>
                     </form>
                  </Card.Body>
               </Card>
            </Modal.Body>
         </Modal>
      </>
   );
}
