import { By, until } from 'selenium-webdriver';

// Import helper functions
import {
   closeToastIfVisible,
   initializeTestDriver,
   submitForm,
   takeScreenshot,
   verifyToastMessage
} from './authHelpers.js'; // Adjust the path based on your file structure

describe('Register Form Tests: testing empty field(s) submission', function () {
   this.timeout(60000);  // Increased timeout for the test suite
   // Initialize the test driver and get the driver instance
   const getDriver = initializeTestDriver();


   // 1. Test for validation errors when no fields are filled
   it('should show validation errors for empty fields', async function () {
      const driver = getDriver();  // Get the WebDriver instance

      await driver.get('http://localhost:5173/login');

      // Navigate to the register form
      const registerLink = await driver.wait(until.elementLocated(By.css('.register-link')), 10000);
      await registerLink.click();

      // Submit the form without filling in any fields
      await submitForm(driver);

      // Verify the toast message for validation error
      await verifyToastMessage(driver, 'All fields are required.');

      // Close the toast if it's visible
      await closeToastIfVisible(driver);

      // Take a screenshot
      await takeScreenshot(driver, 'validation-errors-empty-fields');
   });
});
