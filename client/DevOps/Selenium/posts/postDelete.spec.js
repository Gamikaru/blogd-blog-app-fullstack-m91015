import { initializeTestDriver, login, logout, findElementWithWait } from '../helpers/commonHelpers.js';
import { By, until } from 'selenium-webdriver';

describe('Post Tests: deleting a post', function () {
   this.timeout(40000); // Extended timeout for more wait times
   const getDriver = initializeTestDriver(); // Set up WebDriver

   it('should delete a post and verify its removal from the homepage', async function () {
      const driver = getDriver();
      const postContent = 'Hello everyone! This is my first post.'; // Content of the post you want to delete

      // Step 1: Log in
      console.log("Starting test: Logging in...");
      await driver.get('http://localhost:5173/login');
      await login(driver, 'test@test.com', 'test');
      console.log("Logged in successfully.");

      // Add 3-second wait after login
      await driver.sleep(3000);

      try {
         // Step 2: Locate the post card containing the specific post content
         console.log(`Looking for the post card with content: "${postContent}"...`);
         const postCard = await findElementWithWait(driver, `//div[contains(@class, 'post-container')]//p[contains(text(), "${postContent}")]`, true, 15000);

         if (!postCard) {
            throw new Error(`Post card with content "${postContent}" not found!`);
         }

         // Step 3: Locate and click the delete button inside the correct post card
         console.log("Finding the delete button within the post card...");
         const deleteButton = await findElementWithWait(driver, `//p[contains(text(), "${postContent}")]/ancestor::div[contains(@class, "post-container")]//button[contains(@class, "delete-button")]`, true, 15000);

         if (deleteButton) {
            console.log("Delete button found, clicking it...");
            await deleteButton.click();
         } else {
            throw new Error("Delete button not found within the post card!");
         }

         // Step 4: Confirm deletion by clicking 'Yes' in the toast notification
         console.log("Waiting for confirmation button in the toast...");
         const confirmButton = await findElementWithWait(driver, `.toast-primary-btn`, false, 10000);  // CSS selector here
         if (confirmButton) {
            console.log("Confirmation button found, clicking it...");
            await confirmButton.click();
         } else {
            throw new Error("Confirmation button in the toast not found!");
         }

         // Step 5: Verify the post is no longer visible
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

      // Step 6: Log out
      console.log("Logging out...");
      await logout(driver);
      console.log("Test completed: User logged out.");

      // Add 3-second wait before completing the test
      await driver.sleep(3000);
   });
});
