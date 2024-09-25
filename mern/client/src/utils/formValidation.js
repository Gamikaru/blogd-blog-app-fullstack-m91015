// utils/formValidation.js

/**
 * Capitalizes the first letter of a given string.
 * @param {string} string - The string to capitalize.
 * @returns {string} - The capitalized string.
 */
export const capitalizeFirstLetter = (string) => {
   return string.charAt(0).toUpperCase() + string.slice(1);
};

/**
 * Validates the registration form data.
 * @param {Object} formData - The form data to validate.
 * @returns {Object} - An object containing any validation errors.
 */
export const validateRegForm = (formData) => {
   const errors = {};
   if (!formData.firstName) errors.firstName = "First name is required";
   if (!formData.lastName) errors.lastName = "Last name is required";
   if (!formData.email) errors.email = "Email is required";
   if (!formData.password) errors.password = "Password is required";
   if (!formData.birthDate) errors.birthDate = "Birth date is required";
   if (!formData.occupation) errors.occupation = "Occupation is required";
   if (!formData.location) errors.location = "Location is required";
   return errors;
};

/**
 * Validates the login form data.
 * @param {Object} formData - The login form data to validate.
 * @returns {Object} - An object containing any validation errors.
 */
export const validateLoginForm = (formData) => {
   const errors = {};
   if (!formData.email) errors.email = "Email is required";
   if (!formData.password) errors.password = "Password is required";
   return errors;
};

/**
 * Validates post content.
 * @param {string} postContent - The content of the post.
 * @returns {string|null} - An error message or null if valid.
 */
export const validatePostContent = (postContent) => {
   if (!postContent.trim()) {
      return "Post content cannot be empty.";
   }
   if (postContent.length < 10) {
      return "Post content must be at least 10 characters.";
   }
   return null;
};
