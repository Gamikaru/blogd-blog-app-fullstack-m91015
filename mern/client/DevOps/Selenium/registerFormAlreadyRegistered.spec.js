import { Builder, By, until } from 'selenium-webdriver';
import {
   fillInputField,
   fillDatePicker,
   selectDropdownOption,
   submitForm,
   verifyToastMessage,
   closeToastIfVisible,
   takeScreenshot
} from './registerFormHelpers.js';  // Adjust the path if necessary

describe('Register Form Tests: registering with an already registered email', function () {
   this.timeout(60000);  // Increased timeout for the test suite
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

   it('should show an error for pre-existing email', async function () {
      console.log('Test: Pre-existing email error');
      await driver.get('http://localhost:5173/login');

      const registerLink = await driver.wait(until.elementLocated(By.css('.register-link')), 10000);
      await registerLink.click();
      console.log('Navigated to register form');

      // Fill in the first name
      await fillInputField(driver, '.register-first-name-input', 'Test');

      // Fill in the last name
      await fillInputField(driver, '.register-last-name-input', 'User');

      // Fill in the email (pre-existing)
      await fillInputField(driver, '.register-email-input', 'gavrielmrudolph@gmail.com');

      // Verify the value of the email field
      const emailField = await driver.findElement(By.css('.register-email-input'));
      const emailValue = await emailField.getAttribute('value');
      console.log(`Email field contains: ${emailValue}`);
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
      console.log(`Birth Date entered: ${enteredDate}`);

      // Select location from the dropdown
      await selectDropdownOption(driver, '.select-control', 'Tokyo');  // Corrected selector

      // Fill in the occupation
      await fillInputField(driver, '.register-occupation-input', 'Software Developer');

      // Submit the form
      await submitForm(driver);
      console.log('Submit button clicked for pre-existing email');

      // Verify the toast message for existing email error
      await verifyToastMessage(driver, 'Email already registered.');

      // Close the toast if it's visible
      await closeToastIfVisible(driver);

      // Take a screenshot after form submission
      await takeScreenshot(driver, 'pre-existing-email-error');
   });
});
