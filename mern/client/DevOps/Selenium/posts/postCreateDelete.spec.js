import { createPost } from './postHelpers.js';
import { initializeTestDriver, login, logout, findElementWithWait } from '../helpers/commonHelpers.js';
import { By, until } from 'selenium-webdriver';

describe('Post Tests: creating and deleting a post', function () {
   this.timeout(40000); // Extended timeout for more wait times
   const getDriver = initializeTestDriver(); // Set up WebDriver

   it('should create a post if not present, then delete it and verify its removal', async function () {
      const driver = getDriver();
      const postContent = 'Hello everyone! This is my first post.'; // The content of the post you want to manage

      // Step 1: Log in
      console.log("Starting test: Logging in...");
      await driver.get('http://localhost:5173/login');
      await login(driver, 'test@test.com', 'test');
      console.log("Logged in successfully.");

      // Add 3-second wait after login
      await driver.sleep(3000);

      try {
         // Step 2: Check if the post already exists
         console.log(`Checking for existing post with content: "${postContent}"...`);
         let postExists = false;
         try {
            const postCard = await findElementWithWait(driver, `//div[contains(@class, 'post-container')]//p[contains(text(), "${postContent}")]`, true, 5000);
            if (postCard) {
               postExists = true;
               console.log("Post already exists.");
            }
         } catch (err) {
            console.log("Post not found, will create a new one.");
         }

         // Step 3: If the post doesn't exist, create it
         if (!postExists) {
            console.log("Creating a new post...");
            await createPost(driver, postContent);
            console.log("Post created.");

            // Add 3-second wait after post creation to ensure it's processed
            await driver.sleep(3000);

            // Verify the post appears on the home page
            console.log("Verifying the new post appears on the home page...");
            const postElement = await driver.wait(until.elementLocated(By.xpath(`//p[contains(text(), "${postContent}")]`)), 15000);
            await driver.wait(until.elementIsVisible(postElement), 15000);

            const postText = await postElement.getText();
            if (postText.trim() !== postContent.trim()) {
               throw new Error(`Post content mismatch. Expected: "${postContent}", but found: "${postText}"`);
            }
            console.log("Verified that the new post is rendered on the home page.");
         }

         // Step 4: Now delete the post
         console.log("Finding the delete button within the post card...");
         const deleteButton = await findElementWithWait(driver, `//p[contains(text(), "${postContent}")]/ancestor::div[contains(@class, "post-container")]//button[contains(@class, "delete-button")]`, true, 15000);

         if (deleteButton) {
            console.log("Delete button found, clicking it...");
            await deleteButton.click();
         } else {
            throw new Error("Delete button not found within the post card!");
         }

         // Step 5: Confirm deletion by clicking 'Yes' in the toast notification
         console.log("Waiting for confirmation button in the toast...");
         const confirmButton = await findElementWithWait(driver, `.toast-primary-btn`, false, 10000); // CSS selector here
         if (confirmButton) {
            console.log("Confirmation button found, clicking it...");
            await confirmButton.click();
         } else {
            throw new Error("Confirmation button in the toast not found!");
         }

         // Step 6: Verify the post is no longer visible
         console.log("Verifying the post is removed...");
         await driver.sleep(2000); // Small delay to ensure deletion completes

         const deletedPost = await driver.findElements(By.xpath(`//p[contains(text(), "${postContent}")]`));
         if (deletedPost.length > 0) {
            console.log("Remaining posts:", deletedPost.length);
            throw new Error(`Post "${postContent}" was not deleted successfully.`);
         } else {
            console.log(`Post "${postContent}" successfully deleted.`);
         }

      } catch (error) {
         console.error("Error during test execution:", error.message);
         throw error; // Ensure the test fails when an error occurs
      }

      // Step 7: Log out
      console.log("Logging out...");
      await logout(driver);
      console.log("Test completed: User logged out.");

      // Add 3-second wait before completing the test
      await driver.sleep(3000);
   });
});
