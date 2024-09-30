
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
   console.log("Found the post button, clicking it...");
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

   // Step 3: Focus on the textarea
   await driver.executeScript("arguments[0].focus();", postTextArea);
   await driver.sleep(500);  // Wait after focusing

   // Step 4: Trigger React's onChange event with a synthetic event
   console.log("Triggering React onChange event with synthetic event...");
   await driver.executeScript((textarea, content) => {
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value').set;
      nativeInputValueSetter.call(textarea, content);

      const event = new Event('input', { bubbles: true });
      textarea.dispatchEvent(event);
   }, postTextArea, postContent);

   // Step 5: Wait for React to update the state
   await driver.sleep(1000);  // Wait for the state to update in React

   // Step 6: Confirm the content was entered correctly
   const enteredValue = await postTextArea.getAttribute('value');
   console.log(`Post content after filling: "${enteredValue}"`);

   if (enteredValue.trim() !== postContent.trim()) {
      console.log(`Error: Post content not set correctly. Expected: "${postContent}", but got: "${enteredValue}".`);
      await takeScreenshot(driver, 'post-content-error');
      throw new Error(`Post content not set correctly in the textarea. Expected: "${postContent}", but got: "${enteredValue}"`);
   }

   await takeScreenshot(driver, 'post-content-filled');  // Screenshot after content is filled

   // Step 7: Scroll the submit button into view and click it
   console.log("Ensuring the submit button is visible...");
   const submitButton = await findElementWithWait(driver, '.post-submit-btn', false, 15000);
   await driver.executeScript("arguments[0].scrollIntoView(true);", submitButton);
   await driver.sleep(500);  // Short delay to ensure scroll completes

   await takeScreenshot(driver, 'before-submit-click');  // Screenshot before clicking submit

   // Step 8: Delay form submission to ensure React has processed the state update
   console.log("Submitting the post...");
   await driver.sleep(1000);  // Additional wait for React to finalize

   try {
      await submitButton.click();  // Attempt to click the submit button
   } catch (error) {
      console.log("Direct click failed, using JavaScript click.");
      await driver.executeScript("arguments[0].click();", submitButton);  // Fallback to JavaScript click
   }

   // Step 9: Ensure the modal is closed before looking for the toast
   console.log("Waiting for modal to close...");
   await driver.wait(until.stalenessOf(postTextArea), 10000);  // Wait for modal to close

   await takeScreenshot(driver, 'modal-closed');  // Screenshot after modal closes

   // Step 10: Explicitly wait for the toast message to become visible
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
   await driver.wait(until.elementIsVisible(await driver.findElement(By.id('editPostContent'))), 15000);

   console.log("Filling in the new post content...");
   await fillPostContent(driver, '#editPostContent', newContent);

   console.log("Submitting the edited post...");
   await submitPost(driver, '.edit-post-submit-btn'); // Use common form submission helper

   await driver.sleep(1000); // Allow time for edit processing

   await verifyToastMessage(driver, 'Post edited successfully!'); // Verify success toast
   console.log("Post edited successfully.");
}

// Helper to delete a post
export async function deletePost(driver) {
   console.log("Attempting to delete the post...");

   const deleteButton = await findElementWithWait(driver, '.delete-button', false, 15000);
   if (deleteButton) {
      console.log("Found the delete button, clicking it...");
      await deleteButton.click();
   } else {
      throw new Error('Delete button not found.');
   }

   await driver.sleep(1000); // Allow time for deletion

   await verifyToastMessage(driver, 'Post deleted successfully!'); // Verify deletion toast
   console.log("Post deleted successfully.");

   // Verify that the post is removed from the DOM
   const postExists = await driver.findElements(By.css('.post-container'));
   if (postExists.length > 0) {
      throw new Error('Post was not deleted successfully.');
   }
   console.log("Post successfully removed from the DOM.");
}
export async function fillPostContent(driver, selectorOrPlaceholder, value) {
   const inputField = await findElementWithWait(driver, selectorOrPlaceholder.startsWith('.')
      ? selectorOrPlaceholder
      : `input[placeholder="${selectorOrPlaceholder}"]`);

   await inputField.clear();
   await inputField.sendKeys(value);

   // Dispatch input and change events to ensure React recognizes the change
   await driver.executeScript("arguments[0].dispatchEvent(new Event('input', { bubbles: true }));", inputField);
   await driver.executeScript("arguments[0].dispatchEvent(new Event('change', { bubbles: true }));", inputField);

   await driver.sleep(500);  // Optional sleep for stability
}

// Helper for submitting a post
export async function submitPost(driver, submitButtonCss = '.submit-btn') {
   const submitBtn = await findElementWithWait(driver, submitButtonCss);

   // Scroll into view before attempting to click
   await driver.executeScript("arguments[0].scrollIntoView(true);", submitBtn);

   try {
      await submitBtn.click();  // Attempt direct click
   } catch (error) {
      // If the direct click fails, use JavaScript click
      console.log("Direct click failed, falling back to JavaScript click.");
      await driver.executeScript("arguments[0].click();", submitBtn);
   }

   await driver.sleep(2000);  // Adding sleep to ensure the action completes
}
