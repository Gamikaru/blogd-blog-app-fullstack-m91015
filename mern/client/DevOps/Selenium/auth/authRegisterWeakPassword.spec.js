import { By, until } from 'selenium-webdriver';
import {
   closeToastIfVisible,
   fillDatePicker,
   fillInputField,
   initializeTestDriver,
   selectDropdownOption,
   submitForm,
   takeScreenshot,
   verifyInlineError
} from './authHelpers.js'; // Adjust the path if necessary

describe('Register Form Tests: weak password validation', function () {
   this.timeout(60000); // Increased timeout for the test suite

   // Initialize the test driver and get the driver instance
   const getDriver = initializeTestDriver();  // Combined helper manages setup and teardown

   it('should show an inline error for weak password', async function () {
      const driver = getDriver();  // Get the WebDriver instance

      await driver.get('http://localhost:5173/login');

      // Navigate to the registration form
      const registerLink = await driver.wait(until.elementLocated(By.css('.register-link')), 10000);
      await registerLink.click();

      // Fill in the first name
      await fillInputField(driver, '.register-first-name-input', 'Test');

      // Fill in the last name
      await fillInputField(driver, '.register-last-name-input', 'User');

      // Fill in the email
      await fillInputField(driver, '.register-email-input', 'test@example.com');

      // Fill in the weak password
      await fillInputField(driver, '.register-password-input', '12345');

      // Fill in the confirm password (same weak password)
      await fillInputField(driver, '.register-confirm-password-input', '12345');

      // Enter birth date as MMDDYYYY (12241996)
      await fillDatePicker(driver, '.register-birthdate-input', '12241996');

      // Select location from the dropdown
      await selectDropdownOption(driver, '.select-control', 'Tokyo');

      // Fill in the occupation
      await fillInputField(driver, '.register-occupation-input', 'Software Developer');

      // Submit the form
      await submitForm(driver);
      console.log('Submit button clicked for weak password');

      // Take a screenshot before checking the error
      await takeScreenshot(driver, 'weak-password-error');

      // Close the toast if it's visible (just in case)
      await closeToastIfVisible(driver);

      // Verify the inline error for the password field
      await verifyInlineError(driver, '.register-password-input ~ span.error-label', 'Password must be at least 8 characters long and include letters, numbers, and special characters.');
   });
});
