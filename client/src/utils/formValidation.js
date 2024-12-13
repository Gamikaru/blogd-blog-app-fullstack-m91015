// src/utils/formValidation.js

/**
 * Capitalizes the first letter of a given string.
 * @param {string} string - The string to capitalize.
 * @returns {string} - The capitalized string.
 */
export const capitalizeFirstLetter = (string) => {
    if (typeof string !== 'string' || !string) return '';
    return string.charAt(0).toUpperCase() + string.slice(1);
};

/**
 * Validates the registration form data.
 * @param {Object} formData - The form data to validate.
 * @returns {Object} - An object containing any validation errors and a flag if all fields are empty.
 */
export const validateRegForm = (formData) => {
    const errors = {};
    let allFieldsEmpty = true; // To track if all fields are empty

    // Helper function to check if a field is empty
    const isEmpty = (value) => !value || !value.trim();

    // Validate first name
    if (isEmpty(formData.firstName)) {
        errors.firstName = 'First name is required.';
    } else {
        allFieldsEmpty = false;
        if (formData.firstName.length < 2) {
            errors.firstName = 'First name must be at least 2 characters long.';
        }
    }

    // Validate last name
    if (isEmpty(formData.lastName)) {
        errors.lastName = 'Last name is required.';
    } else {
        allFieldsEmpty = false;
        if (formData.lastName.length < 2) {
            errors.lastName = 'Last name must be at least 2 characters long.';
        }
    }

    // Validate email
    const email = formData.email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (isEmpty(email)) {
        errors.email = 'Email is required.';
    } else {
        allFieldsEmpty = false;
        if (!emailRegex.test(email)) {
            errors.email = 'Please enter a valid email address.';
        }
    }

    // Validate password
    const password = formData.password || '';
    if (isEmpty(password)) {
        errors.password = 'Password is required.';
    } else {
        allFieldsEmpty = false;
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&]).{8,}$/;
        if (!passwordRegex.test(password)) {
            errors.password =
                'Password must be at least 8 characters long and include letters, numbers, and special characters.';
        }
    }

    // Validate password confirmation
    if (isEmpty(formData.confirmPassword)) {
        errors.confirmPassword = 'Please confirm your password.';
    } else {
        allFieldsEmpty = false;
        if (formData.password !== formData.confirmPassword) {
            errors.confirmPassword = 'Passwords do not match.';
        }
    }

    // Validate birth date
    const today = new Date();
    const birthDate = new Date(`${formData.birthDate}T00:00:00Z`);

    if (!formData.birthDate) {
        errors.birthDate = 'Birth date is required.';
    } else {
        allFieldsEmpty = false;
        if (birthDate > today) {
            errors.birthDate = 'Birth date cannot be in the future.';
        } else {
            let age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();
            if (
                monthDiff < 0 ||
                (monthDiff === 0 && today.getDate() < birthDate.getDate())
            ) {
                age--;
            }
            if (age < 18) {
                errors.birthDate = 'You must be at least 18 years old to register.';
            }
        }
    }

    // Validate occupation
    if (isEmpty(formData.occupation)) {
        errors.occupation = 'Occupation is required.';
    } else {
        allFieldsEmpty = false;
        if (formData.occupation.length < 2) {
            errors.occupation = 'Occupation must be at least 2 characters long.';
        }
    }

    // Validate location
    const allowedLocations = [
        'Washington, D.C.', 'Ottawa', 'Mexico City', 'London', 'Paris', 'Berlin',
        'Rome', 'Madrid', 'Tokyo', 'Beijing', 'Canberra', 'Brasília', 'Moscow',
        'New Delhi', 'Cairo', 'Buenos Aires', 'Ankara', 'Seoul', 'Bangkok', 'Jakarta',
    ];
    if (!formData.location) {
        errors.location = 'Location is required.';
    } else {
        allFieldsEmpty = false;
        if (!allowedLocations.includes(formData.location)) {
            errors.location = 'Please select a valid location from the list.';
        }
    }

    return { errors, allFieldsEmpty };
};

/**
 * Validates the login form data.
 * @param {Object} formData - The login form data to validate.
 * @returns {Object} - An object containing any validation errors.
 */
export const validateLoginForm = (formData) => {
    const errors = {};

    // Validate email
    const email = formData.email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
        errors.email = 'Email is required.';
    } else if (!emailRegex.test(email)) {
        errors.email = 'Please enter a valid email address.';
    }

    // Validate password
    const password = formData.password || '';
    if (!password) {
        errors.password = 'Password is required.';
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
        return 'Post content cannot be empty.';
    }

    // Validate minimum length
    if (trimmedContent.length < 10) {
        return 'Post content must be at least 10 characters long.';
    }

    // Validate maximum length
    if (trimmedContent.length > 10000) {
        return 'Post content cannot exceed 10000 characters.';
    }

    // List of restricted words (commonly blocked words)
    const restrictedWords = [
        // [List of restricted words]
    ];

    // Check for restricted words (case-insensitive)
    for (let word of restrictedWords) {
        const escapedWord = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`\\b${escapedWord}\\b`, 'i');
        if (regex.test(trimmedContent)) {
            return `Inappropriate language detected in post content. The word "${word}" is not allowed.`;
        }
    }

    return null;
};
