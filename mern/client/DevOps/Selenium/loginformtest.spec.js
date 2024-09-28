import assert from 'assert';
import { Builder, By, until } from 'selenium-webdriver';

describe('Login Form Test', function () {
   this.timeout(30000); // Set timeout for the test suite
   let driver;

   // Set up the browser before each test
   before(async function () {
      driver = await new Builder().forBrowser('chrome').build();
      await driver.manage().window().setRect({ width: 1552, height: 832 }); // Set window size
   });

   // Clean up the browser after each test
   after(async function () {
      await driver.quit();
   });

   it('should log in with valid credentials', async function () {
      // 1. Open the login page
      await driver.get('http://localhost:5173/login');

      // 2. Wait until the email input is visible and interactable
      const emailField = await driver.wait(until.elementLocated(By.css('.login-input-field')), 5000);
      await driver.wait(until.elementIsVisible(emailField), 5000); // Ensure the field is visible
      await emailField.clear(); // Clear any pre-filled value
      await emailField.sendKeys('gavrielmrudolph@gmail.com');

      // 3. Wait until the password input is visible and interactable
      const passwordField = await driver.wait(until.elementLocated(By.css('.password-container .login-input-field')), 5000);
      await driver.wait(until.elementIsVisible(passwordField), 5000);
      await passwordField.clear(); // Clear any pre-filled value
      await passwordField.sendKeys('test');

      // 4. Wait until the submit button is visible and interactable
      const submitBtn = await driver.wait(until.elementLocated(By.css('.submit-btn')), 5000);
      await driver.wait(until.elementIsVisible(submitBtn), 5000);
      await submitBtn.click();

      // 5. Check for loading spinner during submission
      const spinner = await driver.wait(until.elementLocated(By.css('.spinner-border')), 5000);
      assert.ok(spinner, 'Spinner appears during login submission.');

      // 6. Validate successful login by checking for dropdown visibility
      try {
         const dropdown = await driver.wait(until.elementLocated(By.css('.dropdown-toggle')), 5000); // Wait until dropdown is available
         assert.ok(dropdown, 'Dropdown toggle found, login seems successful.');
      } catch (error) {
         console.error('Login failed or dropdown not found.', error);
         assert.fail('Login failed or dropdown not found.');
      }

      // 7. Open the dropdown and select an item
      const dropdownToggle = await driver.wait(until.elementLocated(By.css('.dropdown-toggle')), 5000);
      await driver.wait(until.elementIsVisible(dropdownToggle), 5000);
      await dropdownToggle.click();

      const dropdownItem = await driver.wait(until.elementLocated(By.css('.dropdown-item:nth-child(2)')), 5000);
      await driver.wait(until.elementIsVisible(dropdownItem), 5000);
      await dropdownItem.click();
   });

   it('should show validation errors for empty fields', async function () {
      // 1. Open the login page
      await driver.get('http://localhost:5173/login');

      // 2. Wait until the submit button is visible and interactable, then click it without entering any data
      const submitBtn = await driver.wait(until.elementLocated(By.css('.submit-btn')), 5000);
      await driver.wait(until.elementIsVisible(submitBtn), 5000);
      await submitBtn.click();

      // 3. Wait for the email error to appear in the email container
      try {
         const emailError = await driver.wait(until.elementLocated(By.css('.login-input-container .error-label')), 10000).getText();
         assert.strictEqual(emailError, 'Email is required', 'Correct email validation message displayed');
      } catch (error) {
         console.error('Email error not found.', error);
         assert.fail('Email error not found.');
      }

      // 4. Wait for the password error to appear in the password container
      try {
         const passwordError = await driver.wait(until.elementLocated(By.css('.password-container .error-label')), 10000).getText();
         assert.strictEqual(passwordError, 'Password is required', 'Correct password validation message displayed');
      } catch (error) {
         console.error('Password error not found.', error);
         assert.fail('Password error not found.');
      }

      // 5. Check if the invalid-input class is applied to the fields with errors
      const emailField = await driver.findElement(By.css('.login-input-field'));
      const emailClass = await emailField.getAttribute('class');
      assert.ok(emailClass.includes('invalid-input'), 'Email input is highlighted with invalid-input class.');

      const passwordField = await driver.findElement(By.css('.password-container .login-input-field'));
      const passwordClass = await passwordField.getAttribute('class');
      assert.ok(passwordClass.includes('invalid-input'), 'Password input is highlighted with invalid-input class.');
   });
});
