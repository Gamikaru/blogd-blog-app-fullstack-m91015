import React, { useState, useEffect } from "react";
import { Spinner, CloseButton } from "react-bootstrap"; // Only keeping Spinner for now as it's being used within the button.
import { useCookies } from "react-cookie";
import { usePublicModalContext, useUserUpdate, useNotificationContext } from "../../contexts";
import Logger from "../../utils/Logger";
import { capitalizeFirstLetter, validateRegForm } from "../../utils/formValidation";
import InputField from "../common/InputField";
import SelectField from "../common/SelectField";
import UserService from './../../services/api/UserService';

const initialFormState = {
   firstName: "",
   lastName: "",
   email: "",
   password: "",
   birthDate: "",
   occupation: "",
   location: "",
   status: "",
   authLevel: "basic",
};

export default function RegisterModal() {
   const [registerForm, setRegisterForm] = useState(initialFormState);
   const [loading, setLoading] = useState(false);
   const [errors, setErrors] = useState({});
   const setUser = useUserUpdate();
   const [cookies, setCookie] = useCookies(["PassBloggs", "userID"]);
   const { showModal, togglePublicModal } = usePublicModalContext();
   const { showNotification, setPosition } = useNotificationContext(); // Use NotificationContext

   function updateRegisterForm(value) {
      Logger.info("Updating register form", value);
      setRegisterForm((prev) => ({ ...prev, ...value }));
   }

   // Automatically close the modal after a successful registration and toast notification
   useEffect(() => {
      setPosition('info', false); // Always center for public routes like registration
   }, [setPosition]);

   async function handleRegister(e) {
      e.preventDefault();
      Logger.info("Form submitted", registerForm);

      const formErrors = validateRegForm(registerForm);
      setErrors(formErrors);

      if (Object.keys(formErrors).length > 0) {
         showNotification("Please fill out all required fields.", "error");
         return;
      }

      const capitalizedForm = {
         ...registerForm,
         firstName: capitalizeFirstLetter(registerForm.firstName),
         lastName: capitalizeFirstLetter(registerForm.lastName),
         occupation: capitalizeFirstLetter(registerForm.occupation),
         email: registerForm.email.toLowerCase(),
      };

      setLoading(true);
      try {
         const response = await UserService.registerUser(capitalizedForm);
         if (response.message) {
            showNotification(response.message, "success");

            const userData = response.user;
            if (userData) {
               setCookie("PassBloggs", response.token, { path: "/", maxAge: 24 * 60 * 60 });
               setCookie("userID", userData._id, { path: "/", maxAge: 24 * 60 * 60 });
               setUser(userData);
            }

            // Close modal after success
            setTimeout(() => {
               togglePublicModal(); // Close modal immediately after success
               setRegisterForm(initialFormState); // Reset form on success
            }, 3000); // Keep the toast for 3 seconds before closing
         }
      } catch (error) {
         showNotification(error.message || "Registration failed due to an unexpected error.", "error");
      } finally {
         setLoading(false);
      }
   }

   const capitalCities = [
      "Washington, D.C.", "Ottawa", "Mexico City", "London", "Paris", "Berlin",
      "Rome", "Madrid", "Tokyo", "Beijing", "Canberra", "Brasília", "Moscow",
      "New Delhi", "Cairo", "Buenos Aires", "Ankara", "Seoul", "Bangkok", "Jakarta"
   ];

   return (
      <div className={`register-modal-container ${showModal ? "open" : "closed"}`}>
         <div className="register-modal">
            <div className="register-modal-header">
               <h2 className="register-modal-title">REGISTER</h2>
               <span className="close-button" onClick={togglePublicModal}>
                  <CloseButton />
               </span>
            </div>
            <div className="register-modal-body">
               <div className="register-card">
                  <form onSubmit={handleRegister} className="form-container">
                     <div className="form-row">
                        {/* First Column */}
                        <div className="form-column">
                           <InputField
                              label="First Name"
                              placeholder="Enter your first name"
                              value={registerForm.firstName}
                              onChange={(e) => updateRegisterForm({ firstName: e.target.value })}
                              error={errors.firstName}
                           />
                           <InputField
                              label="Email"
                              placeholder="Enter your email"
                              type="email"
                              value={registerForm.email}
                              onChange={(e) => updateRegisterForm({ email: e.target.value })}
                              error={errors.email}
                           />
                           <InputField
                              label="Birth Date"
                              type="date"
                              value={registerForm.birthDate}
                              onChange={(e) => updateRegisterForm({ birthDate: e.target.value })}
                              error={errors.birthDate}
                           />
                        </div>

                        {/* Second Column */}
                        <div className="form-column">
                           <InputField
                              label="Last Name"
                              placeholder="Enter your last name"
                              value={registerForm.lastName}
                              onChange={(e) => updateRegisterForm({ lastName: e.target.value })}
                              error={errors.lastName}
                           />
                           <InputField
                              label="Password"
                              placeholder="Enter your password"
                              type="password"
                              value={registerForm.password}
                              onChange={(e) => updateRegisterForm({ password: e.target.value })}
                              error={errors.password}
                           />
                           <InputField
                              label="Occupation"
                              placeholder="Enter your occupation"
                              value={registerForm.occupation}
                              onChange={(e) => updateRegisterForm({ occupation: e.target.value })}
                              error={errors.occupation}
                           />
                        </div>
                     </div>

                     {/* Third Row for Select and Status */}
                     <div className="form-row">
                        <SelectField
                           label="Location"
                           options={capitalCities}
                           value={registerForm.location}
                           onChange={(e) => updateRegisterForm({ location: e.target.value })}
                           error={errors.location}
                           className="select-field-location"
                        />
                        <InputField
                           label="Status"
                           placeholder="Enter your status"
                           value={registerForm.status}
                           onChange={(e) => updateRegisterForm({ status: e.target.value })}
                        />
                     </div>

                     {/* Submit Button */}
                     <div className="register-submit-container">
                        <button type="submit" className="register-submit-btn" disabled={loading}>
                           {loading ? <Spinner animation="border" size="sm" /> : "Submit"}
                        </button>
                     </div>
                  </form>
               </div>
            </div>
         </div>
      </div>
   );

}


