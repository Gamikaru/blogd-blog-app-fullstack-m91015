import { createPost } from './postHelpers.js';
import { initializeTestDriver, login, logout, findElementWithWait } from '../helpers/commonHelpers.js';
import { By, until } from 'selenium-webdriver';

describe('Post Tests: creating a post', function () {
   this.timeout(40000); // Extended timeout for more wait times
   const getDriver = initializeTestDriver(); // Set up WebDriver

   it('should create a post and verify its rendering on the homepage', async function () {
      const driver = getDriver();

      // Step 1: Log in
      console.log("Starting test: Logging in...");
      await driver.get('http://localhost:5173/login');
      await login(driver, 'test@test.com', 'test');
      console.log("Logged in successfully.");

      // Add 3-second wait after login
      await driver.sleep(3000);

      // Step 2: Create a post
      const postContent = 'Hello everyone! This is my first post.';
      console.log("Creating a post...");
      await createPost(driver, postContent);
      console.log("Post created.");

      // Add 3-second wait after post creation to ensure it's processed
      await driver.sleep(3000);

      // Step 3: Wait for the newly created post to appear on the home page
      console.log("Verifying the post appears on the home page...");
      const postElement = await driver.wait(until.elementLocated(By.xpath(`//p[contains(text(), "${postContent}")]`)), 15000);
      await driver.wait(until.elementIsVisible(postElement), 15000);

      const postText = await postElement.getText();
      if (postText.trim() !== postContent.trim()) {
         throw new Error(`Post content mismatch. Expected: "${postContent}", but found: "${postText}"`);
      }

      console.log("Verified that the post is rendered on the home page.");

      // Step 4: Log out
      console.log("Logging out...");
      await logout(driver);
      console.log("Test completed: User logged out.");

      // Add 3-second wait before completing the test
      await driver.sleep(3000);
   });
});
