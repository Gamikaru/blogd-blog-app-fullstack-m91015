import { createPost } from './postHelpers.js';
import { initializeTestDriver, login, logout } from '../helpers/commonHelpers.js';

describe('postCreateEditDelete', function () {
   this.timeout(40000); // Extended timeout for more wait times
   const getDriver = initializeTestDriver(); // Set up WebDriver

   it('should create, edit, and delete a post', async function () {
      const driver = getDriver();

      // Step 1: Log in
      console.log("Starting test: Logging in...");
      await driver.get('http://localhost:5173/login');
      await login(driver, 'test@test.com', 'test');
      console.log("Logged in successfully.");

      // Add 3-second wait after login
      await driver.sleep(3000);

      // Step 2: Create a post
      console.log("Creating a post...");
      await createPost(driver, 'Hello everyone! This is my first post.');
      console.log("Post created.");

      // Add 3-second wait after post creation
      await driver.sleep(3000);

      // Step 3: Log out
      console.log("Logging out...");
      await logout(driver);
      console.log("Test completed: User logged out.");

      // Add 3-second wait before completing the test
      await driver.sleep(3000);
   });
});
