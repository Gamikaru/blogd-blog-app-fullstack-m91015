import React, { useEffect, useState } from "react";
import { Card, Modal, Spinner } from "react-bootstrap";
import { useCookies } from "react-cookie";
import { usePublicModalContext, useUserUpdate } from "../../contexts";
import Logger from "../../utils/Logger";
import { capitalizeFirstLetter, validateRegForm } from "../../utils/formValidation";
import CustomToast from "../common/CustomToast";
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
   const [showErrorToast, setShowErrorToast] = useState(false);
   const [showSuccessToast, setShowSuccessToast] = useState(false);
   const [toastMessage, setToastMessage] = useState("");
   const [loading, setLoading] = useState(false);
   const [errors, setErrors] = useState({});
   const setUser = useUserUpdate();
   const [cookies, setCookie] = useCookies(["PassBloggs", "userID"]);
   const { showModal, togglePublicModal } = usePublicModalContext();

   function updateRegisterForm(value) {
      Logger.info("Updating register form", value);
      setRegisterForm((prev) => ({ ...prev, ...value }));
   }

   // Auto-close the modal ONLY after successful registration and display the toast for 5 seconds
   useEffect(() => {
      if (showSuccessToast) {
         const timer = setTimeout(() => {
            setShowSuccessToast(false);
            setRegisterForm(initialFormState); // Reset form on success
            togglePublicModal(); // Close the modal
         }, 5000); // Display toast for 5 seconds

         return () => clearTimeout(timer); // Cleanup timer on component unmount
      }
   }, [showSuccessToast, togglePublicModal]);

   async function handleRegister(e) {
      e.preventDefault();
      Logger.info("Form submitted", registerForm);

      const formErrors = validateRegForm(registerForm);
      setErrors(formErrors);

      if (Object.keys(formErrors).length > 0) {
         setToastMessage("Please fill out all required fields.");
         setShowErrorToast(true);
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
            setToastMessage(response.message);
            setShowSuccessToast(true);

            const userData = response.user;
            if (userData) {
               setCookie("PassBloggs", response.token, { path: "/", maxAge: 24 * 60 * 60 });
               setCookie("userID", userData._id, { path: "/", maxAge: 24 * 60 * 60 });
               setUser(userData);
            }
         }
      } catch (error) {
         setToastMessage(error.message || "Registration failed due to an unexpected error.");
         setShowErrorToast(true);
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
      <>
         <Modal show={showModal} onHide={togglePublicModal} centered className="register-modal-container">
            <Modal.Header className="register-modal-header" closeButton>
               <Modal.Title className="register-modal-title">REGISTER</Modal.Title>
            </Modal.Header>
            <Modal.Body className="register-modal-body">
               <Card className="register-card">
                  <Card.Body className="register-card-body">
                     <form onSubmit={handleRegister} className="form-container">
                        <div className="form-row">
                           <InputField
                              label="First Name"
                              placeholder="Enter your first name"
                              value={registerForm.firstName}
                              onChange={(e) => updateRegisterForm({ firstName: e.target.value })}
                              error={errors.firstName}
                           />
                           <InputField
                              label="Last Name"
                              placeholder="Enter your last name"
                              value={registerForm.lastName}
                              onChange={(e) => updateRegisterForm({ lastName: e.target.value })}
                              error={errors.lastName}
                           />
                        </div>
                        <div className="form-row">
                           <InputField
                              label="Email"
                              placeholder="Enter your email"
                              type="email"
                              value={registerForm.email}
                              onChange={(e) => updateRegisterForm({ email: e.target.value })}
                              error={errors.email}
                           />
                           <InputField
                              label="Password"
                              placeholder="Enter your password"
                              type="password"
                              value={registerForm.password}
                              onChange={(e) => updateRegisterForm({ password: e.target.value })}
                              error={errors.password}
                           />
                        </div>
                        <div className="form-row">
                           <InputField
                              label="Birth Date"
                              type="date"
                              value={registerForm.birthDate}
                              onChange={(e) => updateRegisterForm({ birthDate: e.target.value })}
                              error={errors.birthDate}
                           />
                           <InputField
                              label="Occupation"
                              placeholder="Enter your occupation"
                              value={registerForm.occupation}
                              onChange={(e) => updateRegisterForm({ occupation: e.target.value })}
                              error={errors.occupation}
                           />
                        </div>
                        <div className="form-row">
                           <SelectField
                              label="Location"
                              placeholder="Select your location"
                              options={capitalCities}
                              value={registerForm.location}
                              onChange={(e) => updateRegisterForm({ location: e.target.value })}
                              error={errors.location}
                           />
                           <InputField
                              label="Status"
                              placeholder="Enter your status"
                              value={registerForm.status}
                              onChange={(e) => updateRegisterForm({ status: e.target.value })}
                           />
                        </div>
                        <div className="register-submit-container">
                           <button type="submit" className="register-submit-btn" disabled={loading}>
                              {loading ? <Spinner animation="border" size="sm" /> : "Submit"}
                           </button>
                        </div>
                     </form>

                     {/* Custom Toast for success or error messages */}
                     {showSuccessToast && (
                        <CustomToast
                           message={toastMessage}
                           show={showSuccessToast}
                           type="success"
                           autohide
                           delay={5000}
                           onClose={() => setShowSuccessToast(false)}
                        />
                     )}
                     {showErrorToast && (
                        <CustomToast
                           message={toastMessage}
                           show={showErrorToast}
                           type="error"
                           autohide
                           delay={5000}
                           onClose={() => setShowErrorToast(false)} // Only hide the toast on error
                        />
                     )}
                  </Card.Body>
               </Card>
            </Modal.Body>
         </Modal>
      </>
   );

}
