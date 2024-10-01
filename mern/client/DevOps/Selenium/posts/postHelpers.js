import { findElementWithWait, verifyToastMessage, takeScreenshot } from '../helpers/commonHelpers.js';
import { By, until } from 'selenium-webdriver';

// Helper to create a new post
export async function createPost(driver, postContent) {
   console.log("Attempting to create a post...");

   // Step 1: Wait for the Post button to become visible and clickable
   const postButton = await findElementWithWait(driver, '.post-button', false, 15000);
   if (!postButton) {
      throw new Error('Post button not found.');
   }
   console.log("Clicking the post button...");
   await postButton.click();
   await takeScreenshot(driver, 'modal-opened');  // Screenshot after modal opens

   // Add a small wait after clicking the post button
   await driver.sleep(2000);  // Ensure modal opens

   // Step 2: Wait for the modal and textarea to be visible
   console.log("Waiting for post modal to open and textarea to become visible...");
   const postTextArea = await findElementWithWait(driver, '#postContent', false, 15000);
   if (!postTextArea) {
      throw new Error('Post content textarea not found.');
   }

   console.log("Textarea is visible and enabled, focusing on it...");

   // Step 3: Focus on the textarea and ensure React's onChange is triggered
   await driver.executeScript("arguments[0].focus();", postTextArea);
   await driver.sleep(500);  // Wait after focusing

   console.log("Triggering React onChange event with synthetic event...");
   await driver.executeScript((textarea, content) => {
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value').set;
      nativeInputValueSetter.call(textarea, content);

      const event = new Event('input', { bubbles: true });
      textarea.dispatchEvent(event);
   }, postTextArea, postContent);

   // Step 4: Wait for React to update the state
   await driver.sleep(1000);  // Wait for the state to update in React

   // Step 5: Confirm the content was entered correctly
   const enteredValue = await postTextArea.getAttribute('value');
   console.log(`Post content after filling: "${enteredValue}"`);

   if (enteredValue.trim() !== postContent.trim()) {
      console.log(`Error: Post content not set correctly. Expected: "${postContent}", but got: "${enteredValue}".`);
      await takeScreenshot(driver, 'post-content-error');
      throw new Error(`Post content not set correctly in the textarea. Expected: "${postContent}", but got: "${enteredValue}"`);
   }

   await takeScreenshot(driver, 'post-content-filled');  // Screenshot after content is filled

   // Step 6: Scroll the submit button into view and click it
   console.log("Ensuring the submit button is visible...");
   const submitButton = await findElementWithWait(driver, '.post-submit-btn', false, 15000);
   await driver.executeScript("arguments[0].scrollIntoView(true);", submitButton);
   await driver.sleep(500);  // Short delay to ensure scroll completes

   await takeScreenshot(driver, 'before-submit-click');  // Screenshot before clicking submit

   // Step 7: Delay form submission to ensure React has processed the state update
   console.log("Submitting the post...");
   await driver.sleep(1000);  // Additional wait for React to finalize

   try {
      await submitButton.click();  // Attempt to click the submit button
   } catch (error) {
      console.log("Direct click failed, using JavaScript click.");
      await driver.executeScript("arguments[0].click();", submitButton);  // Fallback to JavaScript click
   }

   // Step 8: Ensure the modal is closed before looking for the toast
   console.log("Waiting for modal to close...");
   await driver.wait(until.stalenessOf(postTextArea), 10000);  // Wait for modal to close

   await takeScreenshot(driver, 'modal-closed');  // Screenshot after modal closes

   // Step 9: Explicitly wait for the toast message to become visible
   console.log("Waiting for the success toast message...");
   const toastElement = await driver.wait(until.elementLocated(By.css('.custom-toast-body')), 10000);
   await driver.wait(until.elementIsVisible(toastElement), 10000);  // Ensure the toast is visible

   // Verify the text in the toast message
   const toastText = await toastElement.getText();
   console.log(`Toast message text: ${toastText}`);
   if (toastText.trim() !== "Post submitted successfully!") {
      await takeScreenshot(driver, 'toast-error');  // Screenshot if the toast message is incorrect
      throw new Error(`Expected toast message: "Post submitted successfully!", but got: "${toastText}"`);
   }

   console.log("Post created successfully.");
}


// Helper to edit a post
export async function editPost(driver, newContent) {
   console.log("Attempting to edit the post...");

   const editButton = await findElementWithWait(driver, '.edit-button', false, 15000);
   if (editButton) {
      console.log("Found the edit button, clicking it...");
      await editButton.click();
   } else {
      throw new Error('Edit button not found.');
   }

   // Ensure the modal opens and textarea is visible
   console.log("Waiting for the edit post modal and textarea to be visible...");
   const editTextArea = await findElementWithWait(driver, '#editPostContent', false, 15000);
   if (!editTextArea) {
      throw new Error('Edit post content textarea not found.');
   }

   // Step 3: Clear existing content and fill in new content
   console.log("Filling in the new post content...");
   await editTextArea.clear();
   await driver.executeScript((textarea, content) => {
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value').set;
      nativeInputValueSetter.call(textarea, content);

      const event = new Event('input', { bubbles: true });
      textarea.dispatchEvent(event);
   }, editTextArea, newContent);

   // Step 4: Wait for React to update the state
   await driver.sleep(1000);

   // Step 5: Submit the edited post
   console.log("Submitting the edited post...");
   const submitButton = await findElementWithWait(driver, '.edit-post-submit-btn', false, 15000);
   await driver.executeScript("arguments[0].scrollIntoView(true);", submitButton);
   await driver.sleep(500);  // Short delay to ensure scroll completes
   try {
      await submitButton.click();
   } catch (error) {
      console.log("Direct click failed, using JavaScript click.");
      await driver.executeScript("arguments[0].click();", submitButton);
   }

   await driver.sleep(1000); // Allow time for edit processing

   // Step 6: Verify success toast
   await verifyToastMessage(driver, 'Post edited successfully!');
   console.log("Post edited successfully.");
}

// Helper to delete a post
export async function deletePost(driver, postContent) {
   console.log("Attempting to delete the post...");

   // Step 1: Find the delete button inside the post card
   const deleteButton = await findElementWithWait(driver, `//p[contains(text(), "${postContent}")]/ancestor::div[contains(@class, "post-container")]//button[contains(@class, "delete-button")]`, true, 15000);
   if (deleteButton) {
      console.log("Found the delete button, clicking it...");
      await deleteButton.click();
   } else {
      throw new Error('Delete button not found.');
   }

   // Step 2: Wait for the confirmation toast asking "Are you sure you want to delete this post?"
   console.log("Waiting for confirmation toast message...");
   await verifyToastMessage(driver, 'Are you sure you want to delete this post?');
   console.log("Confirmation toast message received.");

   // Step 3: Click the 'Yes' button in the confirmation toast
   const confirmButton = await findElementWithWait(driver, `.toast-primary-btn`, false, 10000);
   if (confirmButton) {
      console.log("Confirmation button found, clicking it...");
      await confirmButton.click();
   } else {
      throw new Error("Confirmation button in the toast not found!");
   }

   // Step 4: Wait for the success toast to appear after confirming deletion
   console.log("Waiting for the success toast message...");
   await driver.sleep(2000); // Add a small wait to allow the success message to appear
   await verifyToastMessage(driver, 'Post deleted successfully!');
   console.log("Post deleted successfully.");

   // Step 5: Verify that the post is removed from the DOM
   console.log("Verifying the post is removed from the DOM...");
   const deletedPost = await driver.findElements(By.xpath(`//p[contains(text(), "${postContent}")]`));
   if (deletedPost.length > 0) {
      throw new Error(`Post "${postContent}" was not deleted successfully.`);
   }
   console.log(`Post "${postContent}" successfully removed from the DOM.`);
}
