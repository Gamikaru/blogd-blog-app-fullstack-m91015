import { By, until } from 'selenium-webdriver';
import { deleteUser, initializeTestDriver, loginUser, registerUser } from './authHelpers.js'; // Import necessary helpers

describe('Register Form Tests: register user, login, delete user, logout', function () {
   this.timeout(60000); // Set timeout for the test suite
   let authToken; // Store the authentication token

   // Initialize the test driver and get the driver instance
   const getDriver = initializeTestDriver();

   const userData = {
      firstName: 'Test',
      lastName: 'User',
      email: 'newuser@example.com',
      password: 'StrongPassword123!',
      birthDate: '12241996', // MMDDYYYY
      location: 'Tokyo',
      occupation: 'Software Developer',
   };

   it('should register, log in, and then delete the user', async function () {
      const driver = getDriver();  // Get the WebDriver instance

      // Step 1: Preemptively delete the user in case they already exist
      try {
         await deleteUser(userData.email); // Attempt to delete without token first
      } catch (error) {
         console.log('Failed to delete user (preemptive):', error.message);
      }

      // Step 2: Go to registration page and register the user
      await driver.get('http://localhost:5173/login');
      const registerLink = await driver.wait(until.elementLocated(By.css('.register-link')), 10000);
      await registerLink.click();

      // Step 3: Register the user
      await registerUser(driver, userData);

      // Step 4: Log in with the registered user and capture the authentication token
      authToken = await loginUser(driver, userData.email, userData.password);  // Capture the auth token after login

      // Step 5: Delete the user while logged in using the token
      try {
         await deleteUser(userData.email, authToken);  // Delete the user with the captured token
      } catch (error) {
         console.error('Failed to delete user during cleanup:', error.message);
      }
   });
});
