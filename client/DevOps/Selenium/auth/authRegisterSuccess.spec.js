import { By, until } from 'selenium-webdriver';
import { deleteUser, initializeTestDriver, login, registerUser, logout, verifyLoginSuccess } from './authHelpers.js'; // Adjust the path if necessary

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

      // Step 2: Go to login page and open registration modal
      await driver.get('http://localhost:5173/login');
      const registerLink = await driver.wait(until.elementLocated(By.css('.register-link')), 10000);
      await registerLink.click();

      // Step 3: Register the user
      await registerUser(driver, userData);

      // Step 4: Wait for the registration modal to close and login form to appear
      // Replace '.register-modal' with your actual modal selector
      const registerModal = await driver.findElement(By.css('.register-modal'));
      await driver.wait(until.stalenessOf(registerModal), 10000);

      // Alternatively, wait for the login form to be visible
      await driver.wait(until.elementLocated(By.css('.login-input-field')), 10000);

      // Step 5: Log in with the registered user
      await login(driver, userData.email, userData.password);

      // Step 6: Verify login success
      await verifyLoginSuccess(driver);

      // Retrieve the authToken from cookies
      const cookie = await driver.manage().getCookie('PassBloggs');
      authToken = cookie ? cookie.value : null;
      if (!authToken) {
         throw new Error('Authentication token not found');
      }

      // Step 7: Delete the user while logged in using the token
      try {
         await deleteUser(userData.email, authToken);  // Delete the user with the captured token
      } catch (error) {
         console.error('Failed to delete user during cleanup:', error.message);
      }

      // Step 8: Log out
      await logout(driver);
   });
});
