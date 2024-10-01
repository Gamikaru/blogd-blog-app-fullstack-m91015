import { By, until } from 'selenium-webdriver';
import {
   closeToastIfVisible,
   fillDatePicker,
   fillInputField,
   initializeTestDriver,
   selectRandomLocation,
   submitForm,
   takeScreenshot,
   verifyInlineError
} from './authHelpers.js'; // Adjust the path if necessary

describe('Register Form Tests: registering with an invalid email', function () {
   this.timeout(60000);  // Increased timeout for the test suite

   // Initialize the test driver and get the driver instance
   const getDriver = initializeTestDriver();

   // Test for invalid email format error
   it('should show an inline error for invalid email format', async function () {
      const driver = getDriver();  // Get the WebDriver instance
      await driver.get('http://localhost:5173/login');

      // Click on the register link to navigate to the registration form
      const registerLink = await driver.wait(until.elementLocated(By.css('.register-link')), 10000);
      await registerLink.click();

      // Fill in the first name
      await fillInputField(driver, '.register-first-name-input', 'Test');

      // Fill in the last name
      await fillInputField(driver, '.register-last-name-input', 'User');

      // Fill in the invalid email
      await fillInputField(driver, '.register-email-input', 'invalid-email.com');

      // Fill in the password
      await fillInputField(driver, '.register-password-input', 'TestPassword123!');

      // Fill in the confirm password
      await fillInputField(driver, '.register-confirm-password-input', 'TestPassword123!');

      // Enter birth date as MMDDYYYY (12241996)
      await fillDatePicker(driver, '.register-birthdate-input', '12241996');

      // Select random location from the dropdown
      await selectRandomLocation(driver, '.select-control');

      // Fill in the occupation
      await fillInputField(driver, '.register-occupation-input', 'Software Developer');

      // Submit the form
      await submitForm(driver);
      console.log('Submit button clicked for invalid email format');

      // Take a screenshot before checking the inline error
      await takeScreenshot(driver, 'invalid-email-format-error');

      // Close the toast if it's visible (just in case)
      await closeToastIfVisible(driver);

      // Verify the inline error for the email field
      await verifyInlineError(driver, '.register-email-input ~ span.error-label', 'Please enter a valid email address.');
   });
});
