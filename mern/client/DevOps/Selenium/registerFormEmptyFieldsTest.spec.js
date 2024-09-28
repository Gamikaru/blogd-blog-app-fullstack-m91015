import { Builder, By, until } from 'selenium-webdriver';

// Import helper functions
import {
   closeToastIfVisible,
   submitForm,
   takeScreenshot,
   verifyToastMessage
} from './registerFormHelpers.js'; // Adjust the path based on your file structure

describe('Register Form Tests: testing empty field(s) submission', function () {
   this.timeout(60000);  // Increased timeout for the test suite
   let driver;

   // Set up the browser before each test
   beforeEach(async function () {
      driver = new Builder().forBrowser('chrome').build();
      await driver.manage().window().setRect({ width: 1552, height: 832 });
      console.log('Browser setup completed');
   });

   // Clean up the browser after each test
   afterEach(async function () {
      await driver.quit();
      console.log('Browser closed');
   });

   // 1. Test for validation errors when no fields are filled
   it('should show validation errors for empty fields', async function () {
      console.log('Test: Validation for empty fields');
      await driver.get('http://localhost:5173/login');

      // Navigate to the register form
      const registerLink = await driver.wait(until.elementLocated(By.css('.register-link')), 10000);
      await registerLink.click();
      console.log('Navigated to register form');

      // Submit the form without filling in any fields
      await submitForm(driver);
      console.log('Submit button clicked without filling fields');

      // Verify the toast message for validation error
      await verifyToastMessage(driver, 'All fields are required.');

      // Close the toast if it's visible
      await closeToastIfVisible(driver);

      // Take a screenshot
      await takeScreenshot(driver, 'validation-errors-empty-fields');
   });
});
