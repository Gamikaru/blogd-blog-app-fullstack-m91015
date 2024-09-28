import assert from 'assert'; // For message verification
import fs from 'fs'; // For file operations
import { By, until } from 'selenium-webdriver';
import axios from 'axios'; // For API requests

// Function to fill text input fields (handles both placeholder and CSS selector)
export async function fillInputField(driver, selectorOrPlaceholder, value) {
   let inputField;

   // If selector starts with a dot, assume it's a CSS selector; otherwise, use it as a placeholder
   if (selectorOrPlaceholder.startsWith('.')) {
      inputField = await driver.wait(until.elementLocated(By.css(selectorOrPlaceholder)), 10000);
   } else {
      inputField = await driver.wait(until.elementLocated(By.css(`input[placeholder="${selectorOrPlaceholder}"]`)), 10000);
   }

   await inputField.clear();
   await inputField.sendKeys(value);
   console.log(`${selectorOrPlaceholder} entered: ${value}`);
   await driver.sleep(500);
}

// Function to select an option from a dropdown (handles CSS selectors)
export async function selectDropdownOption(driver, dropdownCss, optionText) {
   const dropdown = await driver.wait(until.elementLocated(By.css(dropdownCss)), 10000);
   await dropdown.click();  // Open the dropdown
   console.log('Dropdown opened');
   await driver.sleep(500);
   await dropdown.findElement(By.xpath(`//option[. = '${optionText}']`)).click();  // Select the option by visible text
   console.log(`Option selected: ${optionText}`);
   await driver.sleep(500);
}

// Function to fill in the date picker (handles both placeholder and CSS selector)
// Function to fill in the date picker (handles both placeholder and CSS selector)
export async function fillDatePicker(driver, selectorOrPlaceholder, dateValue) {
   let dateField;

   // Check if it's a placeholder or a direct CSS selector
   if (selectorOrPlaceholder.startsWith('.')) {
      dateField = await driver.wait(until.elementLocated(By.css(selectorOrPlaceholder)), 10000);
   } else {
      dateField = await driver.wait(until.elementLocated(By.css(`input[placeholder="${selectorOrPlaceholder}"]`)), 10000);
   }

   // Ensure date is entered as MMDDYYYY and converted to YYYY-MM-DD internally
   const formattedDate = `${dateValue.slice(4, 8)}-${dateValue.slice(0, 2)}-${dateValue.slice(2, 4)}`;
   await dateField.clear();
   await dateField.sendKeys(dateValue);  // Send keys as MMDDYYYY
   console.log(`Date entered as: ${dateValue}, formatted as: ${formattedDate}`);
   await driver.sleep(500);
}


// Function to submit the form
export async function submitForm(driver) {
   const submitBtn = await driver.findElement(By.css('.register-submit-btn'));
   await submitBtn.click();
   console.log('Submit button clicked');
   await driver.sleep(2000);  // Adding sleep to ensure the toast is rendered
}

// Function to verify the toast message
export async function verifyToastMessage(driver, expectedMessage) {
   const toast = await driver.wait(until.elementLocated(By.css('.custom-toast-body')), 15000);
   await driver.wait(until.elementIsVisible(toast), 15000);  // Ensure the toast is visible
   const toastMessage = await toast.getText();
   console.log(`Toast Message: ${toastMessage}`);
   assert.strictEqual(toastMessage, expectedMessage, `Toast message verification: ${expectedMessage}`);
}

// Function to close the toast notification if it exists
// Function to close the toast notification if it exists
export async function closeToastIfVisible(driver) {
   try {
      // Target the close button specific to the toast, not the modal
      const toastCloseButton = await driver.findElement(By.css('.custom-toast .close-button'));
      if (await toastCloseButton.isDisplayed()) {
         await toastCloseButton.click();
         console.log("Toast closed successfully.");
      }
   } catch (error) {
      console.log("No visible toast to close.");
   }
}

// Function to take screenshots (optional for debugging)
export async function takeScreenshot(driver, testName) {
   const screenshot = await driver.takeScreenshot();
   const screenshotPath = `DevOps/screenshots/${testName}.png`;
   fs.writeFileSync(screenshotPath, screenshot, 'base64');
   console.log(`Screenshot saved: ${screenshotPath}`);
}

// Function to verify an inline error message for a field
export async function verifyErrorMessageContent(driver, expectedErrorMessage) {
   try {
      // Use XPath to search for the exact error message content
      const errorLabel = await driver.findElement(By.xpath(`//*[contains(text(), '${expectedErrorMessage}')]`));
      const actualErrorMessage = await errorLabel.getText();
      console.log(`Error message found: ${actualErrorMessage}`);

      // Assert that the error message matches what we expect
      if (actualErrorMessage !== expectedErrorMessage) {
         throw new Error(`Expected error message: '${expectedErrorMessage}', but got: '${actualErrorMessage}'`);
      }

      console.log(`Error message content verified: ${expectedErrorMessage}`);
   } catch (error) {
      throw new Error(`Error message not found or incorrect: ${error.message}`);
   }
}

// Function to verify an inline error message for a field
export async function verifyErrorLabel(driver, fieldCssSelector, expectedErrorMessage) {
   try {
      // Locate the field wrapper by its CSS selector
      const fieldWrapper = await driver.wait(until.elementLocated(By.css(`${fieldCssSelector}`)), 2000);
      console.log(`Field wrapper located for: ${fieldCssSelector}`);

      // Wait for the error label to be present in the field wrapper
      const errorLabel = await driver.wait(until.elementLocated(By.css(`${fieldCssSelector} ~ span.error-label`)), 2000);
      const actualErrorMessage = await errorLabel.getText();
      console.log(`Error label found: ${actualErrorMessage}`);

      // Assert that the error message matches the expected message
      if (actualErrorMessage !== expectedErrorMessage) {
         throw new Error(`Expected error message: '${expectedErrorMessage}', but got: '${actualErrorMessage}'`);
      }

      console.log(`Inline error message for ${fieldCssSelector} verified: ${expectedErrorMessage}`);
   } catch (error) {
      throw new Error(`Error label for ${fieldCssSelector} not found or incorrect: ${error.message}`);
   }
}


// Helper to register a new user
// Function to register a user
export async function registerUser(driver, userData) {
   const { firstName, lastName, email, password, birthDate, location, occupation } = userData;

   // Fill in the registration form
   await fillInputField(driver, '.register-first-name-input', firstName);
   await fillInputField(driver, '.register-last-name-input', lastName);
   await fillInputField(driver, '.register-email-input', email);
   await fillInputField(driver, '.register-password-input', password);
   await fillInputField(driver, '.register-confirm-password-input', password);
   await fillDatePicker(driver, '.register-birthdate-input', birthDate);
   await selectDropdownOption(driver, '.register-location-select', location);
   await fillInputField(driver, '.register-occupation-input', occupation);

   // Submit the form
   await submitForm(driver);

   // Check the toast message to determine if registration was successful or the email was already registered
   const toastMessage = await driver.wait(until.elementLocated(By.css('.custom-toast-body')), 15000).getText();

   if (toastMessage === 'Email already registered.') {
      console.log('User is already registered.');
   } else {
      assert.strictEqual(toastMessage, 'User registered successfully', `Toast message verification: ${toastMessage}`);
      console.log('User registered successfully');
   }
}

// Helper to delete the user from the backend
// Helper to delete the user from the backend
export async function deleteUser(email, authToken) {
   try {
      const response = await axios.delete(`http://localhost:5050/user/email/${email}`, {
         headers: {
            Authorization: `Bearer ${authToken}`, // Use the actual token from login
         },
      });

      assert.strictEqual(response.status, 200, 'User was not deleted successfully');
      console.log(`User with email ${email} deleted successfully.`);
   } catch (error) {
      console.error(`Failed to delete user: ${error.response ? error.response.data : error.message}`);
   }
}


// Function to log in a user and return the authentication token
// Function to log in a user and return the authentication token
export async function loginUser(driver, email, password) {
   console.log('Logging in with valid credentials');

   // 1. Open the login page
   await driver.get('http://localhost:5173/login');

   // 2. Fill email field
   const emailField = await driver.wait(until.elementLocated(By.css('.login-input-field')), 5000);
   await driver.wait(until.elementIsVisible(emailField), 5000);
   await emailField.clear();
   await emailField.sendKeys(email);

   // 3. Fill password field
   const passwordField = await driver.wait(until.elementLocated(By.css('.password-container .login-input-field')), 5000);
   await driver.wait(until.elementIsVisible(passwordField), 5000);
   await passwordField.clear();
   await passwordField.sendKeys(password);

   // 4. Click submit button
   const submitBtn = await driver.wait(until.elementLocated(By.css('.submit-btn')), 5000);
   await driver.wait(until.elementIsVisible(submitBtn), 5000);
   await submitBtn.click();

   // 5. Verify login success by checking for dropdown visibility
   try {
      const dropdown = await driver.wait(until.elementLocated(By.css('.dropdown-toggle')), 5000);
      assert.ok(dropdown, 'Login successful, dropdown found');
   } catch (error) {
      console.error('Login failed or dropdown not found', error);
      throw new Error('Login failed');
   }

   // 6. Capture the authentication token directly from localStorage
   const authToken = await driver.executeScript('return localStorage.getItem("authToken");');
   if (!authToken) {
      throw new Error('Authentication token not found');
   }

   console.log('Captured authentication token:', authToken);
   return authToken;
}

