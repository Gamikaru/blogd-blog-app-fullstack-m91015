import { Builder, By, until } from 'selenium-webdriver';
import {
   closeToastIfVisible,
   fillDatePicker,
   fillInputField,
   selectDropdownOption,
   submitForm,
   takeScreenshot,
   verifyErrorLabel,
   verifyErrorMessageContent
} from './registerFormHelpers.js'; // Adjust the path if necessary


describe('Register Form Tests: registering with an invalid email', function () {
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

   // Test for invalid email format error
   it('should show an inline error for invalid email format', async function () {
      console.log('Test: Invalid email format error');
      await driver.get('http://localhost:5173/login');

      // Click on the register link to navigate to the registration form
      const registerLink = await driver.wait(until.elementLocated(By.css('.register-link')), 10000);
      await registerLink.click();
      console.log('Navigated to register form');

      // Fill in the first name
      await fillInputField(driver, '.register-first-name-input', 'Test');

      // Fill in the last name
      await fillInputField(driver, '.register-last-name-input', 'User');

      // Fill in the invalid email
      await fillInputField(driver, '.register-email-input', 'invalid - email.com');

      // Verify the value of the email field
      const emailField = await driver.findElement(By.css('.register-email-input'));
      const emailValue = await emailField.getAttribute('value');
      console.log(`Email field contains: ${emailValue}`);
      if (emailValue !== 'invalid - email.com') {
         throw new Error('Email field did not receive the correct input.');
      }

      // Fill in the password
      await fillInputField(driver, '.register-password-input', 'TestPassword123!');

      // Fill in the confirm password
      await fillInputField(driver, '.register-confirm-password-input', 'TestPassword123!');

      // Enter birth date as MMDDYYYY (12241996)
      await fillDatePicker(driver, '.register-birthdate-input', '12241996');

      const birthDateField = await driver.findElement(By.css('.register-birthdate-input'));
      const enteredDate = await birthDateField.getAttribute('value');
      if (enteredDate !== '1996-12-24') {
         throw new Error('Birth date field did not receive the correct input.');
      }
      console.log(`Birth Date entered: ${enteredDate}`);

      // Select location from the dropdown
      await selectDropdownOption(driver, '.select-control', 'Tokyo');

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
      await verifyErrorMessageContent(driver, 'Please enter a valid email address.');

      await verifyErrorLabel(driver, '.register-email-input', 'Please enter a valid email address.');

   });
});
