import { By, until } from 'selenium-webdriver';
import {
   closeToastIfVisible,
   fillDatePicker,
   fillInputField,
   initializeTestDriver,
   selectDropdownOption,
   submitForm,
   takeScreenshot,
   verifyToastMessage
} from './authHelpers.js'; // Adjust the path if necessary

describe('Register Form Tests: registering with an already registered email', function () {
   this.timeout(60000);  // Increased timeout for the test suite
   // Initialize the test driver and get the driver instance
   const getDriver = initializeTestDriver();

   it('should show an error for pre-existing email', async function () {
      const driver = getDriver();  // Get the WebDriver instance
      await driver.get('http://localhost:5173/login');

      const registerLink = await driver.wait(until.elementLocated(By.css('.register-link')), 10000);
      await registerLink.click();

      // Fill in the first name
      await fillInputField(driver, '.register-first-name-input', 'Test');

      // Fill in the last name
      await fillInputField(driver, '.register-last-name-input', 'User');

      // Fill in the email (pre-existing)
      await fillInputField(driver, '.register-email-input', 'gavrielmrudolph@gmail.com');

      // Verify the value of the email field
      const emailField = await driver.findElement(By.css('.register-email-input'));
      const emailValue = await emailField.getAttribute('value');
      if (emailValue !== 'gavrielmrudolph@gmail.com') {
         throw new Error('Email field did not receive the correct input.');
      }

      // Fill in the password
      await fillInputField(driver, '.register-password-input', 'TestPassword123!');

      // Fill in the confirm password
      await fillInputField(driver, '.register-confirm-password-input', 'TestPassword123!');

      // **Enter birth date as MMDDYYYY (12241996)**
      await fillDatePicker(driver, '.register-birthdate-input', '12241996');

      const birthDateField = await driver.findElement(By.css('.register-birthdate-input'));
      const enteredDate = await birthDateField.getAttribute('value');
      if (enteredDate !== '1996-12-24') {
         throw new Error('Birth date field did not receive the correct input.');
      }

      // Select location from the dropdown
      await selectDropdownOption(driver, '.select-control', 'Tokyo');  // Corrected selector

      // Fill in the occupation
      await fillInputField(driver, '.register-occupation-input', 'Software Developer');

      // Submit the form
      await submitForm(driver);

      // Verify the toast message for existing email error
      await verifyToastMessage(driver, 'Email already registered.');

      // Close the toast if it's visible
      await closeToastIfVisible(driver);

      // Take a screenshot after form submission
      await takeScreenshot(driver, 'pre-existing-email-error');
   });
});
