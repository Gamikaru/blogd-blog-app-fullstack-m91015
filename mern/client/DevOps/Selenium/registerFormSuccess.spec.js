import { Builder, By, until } from 'selenium-webdriver';
import { registerUser, loginUser, deleteUser } from './registerFormHelpers.js'; // Import necessary helpers
import assert from 'assert';

describe('Register, Login, and Cleanup Test', function () {
   this.timeout(60000); // Set timeout for the test suite
   let driver;
   let authToken;  // To store the authentication token
   const userData = {
      firstName: 'Test',
      lastName: 'User',
      email: 'newuser@example.com',
      password: 'StrongPassword123!',
      birthDate: '12241996',  // MMDDYYYY
      location: 'Tokyo',
      occupation: 'Software Developer',
   };

   before(async function () {
      driver = new Builder().forBrowser('chrome').build();
      await driver.manage().window().setRect({ width: 1552, height: 832 });
      console.log('Browser setup completed');
   });

   after(async function () {
      await driver.quit();
      console.log('Browser closed');
   });

   it('should register, log in, and then delete the user', async function () {
      console.log('Test: Register, Log in, and Cleanup');

      // Step 1: Preemptively delete the user in case they already exist
      try {
         console.log('Deleting user if they already exist...');
         await deleteUser(userData.email); // Attempt to delete without token first
         console.log('Preemptive user deletion complete.');
      } catch (error) {
         console.log('Failed to delete user (preemptive):', error.message);
      }

      // Step 2: Go to registration page and register the user
      await driver.get('http://localhost:5173/login');
      const registerLink = await driver.wait(until.elementLocated(By.css('.register-link')), 10000);
      await registerLink.click();
      console.log('Navigated to register form');

      // Step 3: Register the user
      await registerUser(driver, userData);
      console.log('User registration process completed');

      // Step 4: Wait for the modal to close (6 seconds)
      console.log('Waiting for the modal to close...');
      await driver.sleep(6000);  // Wait for the modal to close after successful registration

      // Step 5: Log in with the registered user and capture the authentication token
      console.log('Attempting to log in with the new user...');
      authToken = await loginUser(driver, userData.email, userData.password);  // Capture the auth token after login
      console.log('User logged in successfully with token:', authToken);

      // Step 6: Delete the user while logged in using the token
      try {
         console.log('Deleting the user while logged in...');
         await deleteUser(userData.email, authToken);  // Delete the user with the captured token
         console.log('User deleted successfully');
      } catch (error) {
         console.error('Failed to delete user during cleanup:', error.message);
      }

      // Step 7: Attempt to log out (ensure dropdown opens)
      try {
         console.log('Attempting to log out...');

         // Open the dropdown (ensure it's visible before clicking)
         const dropdownToggle = await driver.wait(until.elementLocated(By.css('.dropdown-toggle')), 10000);
         await driver.wait(until.elementIsVisible(dropdownToggle), 10000);
         await dropdownToggle.click();
         console.log('Dropdown opened');

         // Wait for the logout button to appear and click it
         const logoutButton = await driver.wait(until.elementLocated(By.css('.dropdown-item:nth-child(2)')), 10000);
         await driver.wait(until.elementIsVisible(logoutButton), 10000); // Ensure the button is visible
         console.log('Clicking logout button...');
         await logoutButton.click();
         console.log('Logout button clicked');

         // Confirm we're back at the login page
         const loginUrl = await driver.getCurrentUrl();
         assert.strictEqual(loginUrl, 'http://localhost:5173/login', 'Successfully logged out and returned to the login page.');
         console.log('User logged out successfully');
      } catch (error) {
         console.error('Could not find or click logout button:', error.message);
         throw error;
      }
   });
});
