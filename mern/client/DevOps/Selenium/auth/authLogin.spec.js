import { initializeTestDriver, login, verifyLoginSuccess, verifyInlineError, logout, verifyToastMessage } from './authHelpers.js';
import { findElementWithWait } from './authHelpers.js';

describe('Login Form Tests', function () {
   this.timeout(30000); // Set timeout for the test suite

   const getDriver = initializeTestDriver();

   it('should log in with valid credentials', async function () {
      const driver = getDriver();

      await driver.get('http://localhost:5173/login');
      await login(driver, 'gavrielmrudolph@gmail.com', 'test');

      await verifyLoginSuccess(driver);
      await logout(driver);
   });

   it('should show validation errors for empty fields', async function () {
      const driver = getDriver();
      await driver.get('http://localhost:5173/login');
      const submitBtn = await findElementWithWait(driver, '.submit-btn');
      await submitBtn.click();

      await verifyInlineError(driver, '.login-input-field + .error-label', 'Email is required.');
      await verifyInlineError(driver, '.password-container .login-input-field + .error-label', 'Password is required.');
   });

   it('should show toast for incorrect email', async function () {
      const driver = getDriver();

      await driver.get('http://localhost:5173/login');
      await login(driver, 'unrecognized-email@example.com', 'password');
      await verifyToastMessage(driver, 'No user found with this email.');
   });

   it('should show toast for incorrect password', async function () {
      const driver = getDriver();

      await driver.get('http://localhost:5173/login');
      await login(driver, 'gavrielmrudolph@gmail.com', 'wrongpassword');
      await verifyToastMessage(driver, 'Incorrect password for this user.');
   });
});
