import { Builder, By, until } from 'selenium-webdriver';
import {
   fillInputField,
   fillDatePicker,
   selectDropdownOption,
   submitForm,
   takeScreenshot,
   verifyErrorLabel,
   closeToastIfVisible
} from './registerFormHelpers.js'; // Adjust the path if necessary

describe('Register Form Tests: password mismatch validation', function () {
   this.timeout(60000); // Increased timeout for the test suite
   let driver;

   beforeEach(async function () {
      driver = new Builder().forBrowser('chrome').build();
      await driver.manage().window().setRect({ width: 1552, height: 832 });
      console.log('Browser setup completed');
   });

   afterEach(async function () {
      await driver.quit();
      console.log('Browser closed');
   });

   it('should show an inline error for password mismatch', async function () {
      console.log('Test: Password mismatch error');
      await driver.get('http://localhost:5173/login');

      // Navigate to the registration form
      const registerLink = await driver.wait(until.elementLocated(By.css('.register-link')), 10000);
      await registerLink.click();
      console.log('Navigated to register form');

      // Fill in the first name
      await fillInputField(driver, '.register-first-name-input', 'Test');

      // Fill in the last name
      await fillInputField(driver, '.register-last-name-input', 'User');

      // Fill in the email
      await fillInputField(driver, '.register-email-input', 'test@example.com');

      // Fill in a valid password
      await fillInputField(driver, '.register-password-input', 'TestPassword123!');

      // Fill in a different confirm password (mismatch)
      await fillInputField(driver, '.register-confirm-password-input', 'DifferentPassword123!');

      // Enter birth date as MMDDYYYY (12241996)
      await fillDatePicker(driver, '.register-birthdate-input', '12241996');

      // Select location from the dropdown
      await selectDropdownOption(driver, '.register-location-select', 'Tokyo');

      // Fill in the occupation
      await fillInputField(driver, '.register-occupation-input', 'Software Developer');

      // Submit the form
      await submitForm(driver);
      console.log('Submit button clicked for password mismatch');

      // Take a screenshot before checking the error
      await takeScreenshot(driver, 'password-mismatch-error');

      // Close the toast if it's visible (just in case)
      await closeToastIfVisible(driver);

      // Verify the inline error for password mismatch
      await verifyErrorLabel(driver, '.register-confirm-password-input', 'Passwords do not match.');
   });
});
