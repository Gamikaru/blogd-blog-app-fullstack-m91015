// RegisterModal.jsx
import React, { useEffect, useState, useRef } from "react";
import { CloseButton, Spinner } from "react-bootstrap";
import { useNotificationContext, usePublicModalContext } from "../../contexts";
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
   confirmPassword: "",
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
   const { showModal, togglePublicModal } = usePublicModalContext();
   const { showNotification, setPosition } = useNotificationContext();

   const inputRefs = useRef({
      firstName: null,
      lastName: null,
      email: null,
      password: null,
      confirmPassword: null,
      birthDate: null,
      occupation: null,
      location: null,
   });

   function updateRegisterForm(value) {
      Logger.info("Updating register form", value);
      setRegisterForm((prev) => ({ ...prev, ...value }));
   }

   useEffect(() => {
      setPosition('info', false);
   }, [setPosition]);

   const focusFirstErrorField = (formErrors) => {
      const firstErrorField = Object.keys(formErrors)[0];
      if (inputRefs.current[firstErrorField]) {
         inputRefs.current[firstErrorField].focus();
      }
   };

   async function handleRegister(e) {
      e.preventDefault();
      Logger.info("Form submitted", registerForm);

      const { errors: formErrors, allFieldsEmpty } = validateRegForm(registerForm);
      setErrors(formErrors);

      if (Object.keys(formErrors).length > 0) {
         if (allFieldsEmpty) {
            showNotification("All fields are required.", "error");
         } else {
            showNotification("Please fill out the required fields correctly.", "error");
         }

         focusFirstErrorField(formErrors);
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

            // Removed automatic login after registration

            // Delay modal close to allow users to see success toast
            setTimeout(() => {
               togglePublicModal();
               setRegisterForm(initialFormState);
               setErrors({});
            }, 4000);
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
                        <div className="form-column">
                           <InputField
                              label="First Name"
                              placeholder="Enter your first name"
                              value={registerForm.firstName}
                              onChange={(e) => updateRegisterForm({ firstName: e.target.value })}
                              error={errors.firstName}
                              className="register-first-name-input"
                              ref={(el) => (inputRefs.current.firstName = el)}
                           />
                           <InputField
                              label="Email"
                              placeholder="Enter your email"
                              type="text"
                              value={registerForm.email}
                              onChange={(e) => updateRegisterForm({ email: e.target.value })}
                              error={errors.email}
                              className="register-email-input"
                              ref={(el) => (inputRefs.current.email = el)}
                           />
                           <InputField
                              label="Birth Date"
                              type="date"
                              value={registerForm.birthDate}
                              onChange={(e) => updateRegisterForm({ birthDate: e.target.value })}
                              error={errors.birthDate}
                              className="register-birthdate-input"
                              ref={(el) => (inputRefs.current.birthDate = el)}
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
                              className="register-last-name-input"
                              ref={(el) => (inputRefs.current.lastName = el)}
                           />
                           <InputField
                              label="Password"
                              placeholder="Enter your password"
                              type="password"
                              value={registerForm.password}
                              onChange={(e) => updateRegisterForm({ password: e.target.value })}
                              error={errors.password}
                              className="register-password-input"
                              ref={(el) => (inputRefs.current.password = el)}
                           />
                           <InputField
                              label="Confirm Password"
                              placeholder="Confirm your password"
                              type="password"
                              value={registerForm.confirmPassword}
                              onChange={(e) => updateRegisterForm({ confirmPassword: e.target.value })}
                              error={errors.confirmPassword}
                              className="register-confirm-password-input"
                              ref={(el) => (inputRefs.current.confirmPassword = el)}
                           />
                           <InputField
                              label="Occupation"
                              placeholder="Enter your occupation"
                              value={registerForm.occupation}
                              onChange={(e) => updateRegisterForm({ occupation: e.target.value })}
                              error={errors.occupation}
                              className="register-occupation-input"
                              ref={(el) => (inputRefs.current.occupation = el)}
                           />
                        </div>
                     </div>

                     {/* Third Row */}
                     <div className="form-row">
                        <SelectField
                           label="Location"
                           options={capitalCities}
                           value={registerForm.location}
                           onChange={(e) => updateRegisterForm({ location: e.target.value })}
                           error={errors.location}
                           className="register-location-select"
                           ref={(el) => (inputRefs.current.location = el)}
                        />
                     </div>

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
