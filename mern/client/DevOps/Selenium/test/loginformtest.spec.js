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
      const emailField = await driver.wait(until.elementLocated(By.css('.login-input-container:nth-child(1) .input-control')), 5000);
      await driver.wait(until.elementIsVisible(emailField), 5000); // Ensure the field is visible
      await emailField.clear(); // Clear any pre-filled value
      await emailField.sendKeys('gavrielmrudolph@gmail.com');

      // 3. Wait until the password input is visible and interactable
      const passwordField = await driver.wait(until.elementLocated(By.css('.password-container .input-control')), 5000);
      await driver.wait(until.elementIsVisible(passwordField), 5000);
      await passwordField.clear(); // Clear any pre-filled value
      await passwordField.sendKeys('test');

      // 4. Wait until the submit button is visible and interactable
      const submitBtn = await driver.wait(until.elementLocated(By.css('.submit-btn')), 5000);
      await driver.wait(until.elementIsVisible(submitBtn), 5000);
      await submitBtn.click();

      // 5. Validate successful login by checking for dropdown visibility
      try {
         const dropdown = await driver.wait(until.elementLocated(By.css('.dropdown-toggle')), 5000); // Wait until dropdown is available
         assert.ok(dropdown, 'Dropdown toggle found, login seems successful.');
      } catch (error) {
         console.error('Login failed or dropdown not found.', error);
         assert.fail('Login failed or dropdown not found.');
      }

      // 6. Open the dropdown and select an item
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

      // 3. Wait for the email error to appear
      try {
         const emailError = await driver.wait(until.elementLocated(By.xpath("//*[text()='Email is required']")), 10000).getText();
         assert.strictEqual(emailError, 'Email is required', 'Correct email validation message displayed');
      } catch (error) {
         console.error('Email error not found.', error);
         assert.fail('Email error not found.');
      }

      // 4. Wait for the password error to appear
      try {
         const passwordError = await driver.wait(until.elementLocated(By.xpath("//*[text()='Password is required']")), 10000).getText();
         assert.strictEqual(passwordError, 'Password is required', 'Correct password validation message displayed');
      } catch (error) {
         console.error('Password error not found.', error);
         assert.fail('Password error not found.');
      }
   });
});
