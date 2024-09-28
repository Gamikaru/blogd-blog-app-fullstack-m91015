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

describe('Register Form Tests: weak password validation', function () {
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

   it('should show an inline error for weak password', async function () {
      console.log('Test: Weak password error');
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
      await verifyErrorLabel(driver, '.register-password-input', 'Password must be at least 8 characters long and include letters, numbers, and special characters.');
   });
});
