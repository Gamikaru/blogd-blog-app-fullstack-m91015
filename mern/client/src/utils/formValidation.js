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
   let allFieldsEmpty = true; // To track if all fields are empty

   // Validate first name
   if (!formData.firstName.trim()) {
      errors.firstName = "First name is required.";
   } else {
      allFieldsEmpty = false;
      if (formData.firstName.length < 2) {
         errors.firstName = "First name must be at least 2 characters long.";
      }
   }

   // Validate last name
   if (!formData.lastName.trim()) {
      errors.lastName = "Last name is required.";
   } else {
      allFieldsEmpty = false;
      if (formData.lastName.length < 2) {
         errors.lastName = "Last name must be at least 2 characters long.";
      }
   }

   // Validate email with regex for valid format
   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
   if (!formData.email.trim()) {
      errors.email = "Email is required.";
      console.log("Validation: Email field is considered empty.");
   } else {
      if (!emailRegex.test(formData.email)) {
         errors.email = "Please enter a valid email address.";
         console.log("Validation: Invalid email format detected.");
      }
   }

   // Validate password strength with feedback on missing elements
   const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
   if (!formData.password) {
      errors.password = "Password is required.";
   } else {
      allFieldsEmpty = false;
      if (!passwordRegex.test(formData.password)) {
         errors.password = "Password must be at least 8 characters long and include letters, numbers, and special characters.";
      } else if (formData.password.length < 12) {
         errors.password = "Consider using at least 12 characters for a stronger password.";
      }
   }

   // Validate password confirmation
   if (!formData.confirmPassword) {
      errors.confirmPassword = "Please confirm your password.";
   } else {
      allFieldsEmpty = false;
      if (formData.password !== formData.confirmPassword) {
         errors.confirmPassword = "Passwords do not match.";
      }
   }

   // Validate birth date: Future date check and minimum age (18+)
   const today = new Date();

   // Parse the birth date correctly from the form data (force UTC to avoid timezone issues)
   const birthDate = new Date(`${formData.birthDate}T00:00:00Z`);

   // Calculate the difference in years
   let age = today.getFullYear() - birthDate.getFullYear();

   // Adjust age if the birthdate has not yet occurred this year
   const hasHadBirthdayThisYear = (today.getMonth() > birthDate.getMonth()) ||
      (today.getMonth() === birthDate.getMonth() && today.getDate() >= birthDate.getDate());
   if (!hasHadBirthdayThisYear) {
      age--;  // Reduce the age by 1 if the birthday hasn't occurred yet this year
   }

   if (!formData.birthDate) {
      errors.birthDate = "Birth date is required.";
   } else {
      allFieldsEmpty = false;

      if (birthDate > today) {
         errors.birthDate = "Birth date cannot be in the future.";
      } else if (age < 18) {
         errors.birthDate = "You must be at least 18 years old to register.";
      }
   }

   // Validate occupation
   if (!formData.occupation.trim()) {
      errors.occupation = "Occupation is required.";
   } else {
      allFieldsEmpty = false;
      if (formData.occupation.length < 2) {
         errors.occupation = "Occupation must be at least 2 characters long.";
      }
   }

   // Validate location (only allow specific options)
   const allowedLocations = [
      "Washington, D.C.", "Ottawa", "Mexico City", "London", "Paris", "Berlin",
      "Rome", "Madrid", "Tokyo", "Beijing", "Canberra", "Brasília", "Moscow",
      "New Delhi", "Cairo", "Buenos Aires", "Ankara", "Seoul", "Bangkok", "Jakarta"
   ];
   if (!formData.location) {
      errors.location = "Location is required.";
   } else {
      allFieldsEmpty = false;
      if (!allowedLocations.includes(formData.location)) {
         errors.location = "Please select a valid location from the list.";
      }
   }

   // Return the errors and a flag indicating if all fields are empty
   return { errors, allFieldsEmpty };
};




/**
 * Validates the login form data.
 * @param {Object} formData - The login form data to validate.
 * @returns {Object} - An object containing any validation errors.
 */
export const validateLoginForm = (formData) => {
   const errors = {};

   // Validate email with regex for valid format
   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
   if (!formData.email.trim()) {
      errors.email = "Email is required";
   } else if (!emailRegex.test(formData.email.trim())) {
      errors.email = "Please enter a valid email address";
   }

   // Validate password (no strict strength validation for login)
   if (!formData.password.trim()) {
      errors.password = "Password is required";
   }

   return errors;
};


/**
 * Validates post content.
 * @param {string} postContent - The content of the post.
 * @returns {string|null} - An error message or null if valid.
 */
export const validatePostContent = (postContent) => {
   const trimmedContent = postContent.trim();

   // Validate for empty content
   if (!trimmedContent) {
      return "Post content cannot be empty.";
   }

   // Validate minimum length (e.g., 10 characters as per the original logic)
   if (trimmedContent.length < 10) {
      return "Post content must be at least 10 characters long.";
   }

   // Optional: Validate maximum length (e.g., 5000 characters)
   if (trimmedContent.length > 5000) {
      return "Post content cannot exceed 5000 characters.";
   }

   // List of restricted words (commonly blocked swear words)
   const restrictedWords = [
      "fuck", "shit", "bitch", "asshole", "bastard", "damn", "crap", "dick", "piss", "cock", "pussy",
      "cunt", "slut", "whore", "nigger", "faggot", "motherfucker", "cocksucker", "nigga", "twat",
      "bollocks", "arse", "wanker", "tosser", "bloody", "bugger", "shag", "tit", "dildo", "cum",
      "skank", "spunk", "wank", "prick", "homo", "spaz"
   ];

   // Check for restricted words (case-insensitive)
   for (let word of restrictedWords) {
      const regex = new RegExp(`\\b${word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i'); // Escapes special characters in words
      if (regex.test(trimmedContent)) {
         return `Inappropriate language detected in post content. The word "${word}" is not allowed.`;
      }
   }

   return null;
};

