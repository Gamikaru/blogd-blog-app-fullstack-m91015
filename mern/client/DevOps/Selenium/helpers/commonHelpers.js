import assert from 'assert'; // For message verification
import { Builder, By, until } from 'selenium-webdriver';  // Import Builder for WebDriver
import fs from 'fs'; // For screenshots


// Helper to locate elements with wait (CSS or XPath selectors)
export async function findElementWithWait(driver, selectorOrXPath, isXPath = false, timeout = 10000) {
   if (isXPath) {
      return await driver.wait(until.elementLocated(By.xpath(selectorOrXPath)), timeout);
   } else {
      return await driver.wait(until.elementLocated(By.css(selectorOrXPath)), timeout);
   }
}

// Function to fill text input fields (handles both placeholder and CSS selector)
export async function fillInputField(driver, selectorOrPlaceholder, value) {
   const inputField = await findElementWithWait(driver, selectorOrPlaceholder.startsWith('.')
      ? selectorOrPlaceholder
      : `input[placeholder="${selectorOrPlaceholder}"]`);
   await inputField.clear();
   await inputField.sendKeys(value);
   await driver.sleep(500);  // Optional sleep for stability
}

// Helper to initialize and teardown the WebDriver for tests
export function initializeTestDriver() {
   let driver;
   beforeEach(async function () {
      driver = await new Builder().forBrowser('chrome').build(); // Initialize WebDriver
      await driver.manage().window().setRect({ width: 1552, height: 832 });
   });
   afterEach(async function () {
      if (driver) {
         await driver.quit(); // Quit WebDriver after each test
      }
   });
   return () => driver;  // Return a function to get the driver instance
}

// Function to select an option from a dropdown (handles CSS selectors)
export async function selectDropdownOption(driver, dropdownCss, optionText) {
   const dropdown = await findElementWithWait(driver, dropdownCss);
   await dropdown.click();  // Open the dropdown
   await driver.sleep(500);
   const option = await dropdown.findElement(By.xpath(`//option[. = '${optionText}']`)); // Select by visible text
   await option.click();
   await driver.sleep(500);
}

// Function to submit forms
export async function submitForm(driver, submitButtonCss = '.submit-btn') {
   const submitBtn = await findElementWithWait(driver, submitButtonCss);
   await submitBtn.click();
   await driver.sleep(2000);  // Adding sleep to ensure the action completes
}

// Function to verify a toast message
export async function verifyToastMessage(driver, expectedMessage) {
   const toast = await findElementWithWait(driver, '.custom-toast-body');
   const toastMessage = await toast.getText();
   assert.strictEqual(toastMessage, expectedMessage, `Expected: ${expectedMessage}, but got: ${toastMessage}`);
}

// Function to close a toast notification if visible
export async function closeToastIfVisible(driver) {
   try {
      const toastCloseButton = await driver.findElement(By.css('.custom-toast .close-button'));
      if (await toastCloseButton.isDisplayed()) {
         await toastCloseButton.click();
      }
   } catch (error) {
      // Toast may not be visible, ignore errors
   }
}

// Function to take screenshots (optional for debugging)
export async function takeScreenshot(driver, testName) {
   const screenshot = await driver.takeScreenshot();
   const screenshotPath = `DevOps/screenshots/${testName}.png`;
   fs.writeFileSync(screenshotPath, screenshot, 'base64');
}

// Function to verify an inline error message for a field
export async function verifyInlineError(driver, fieldCssSelectorOrXPath, expectedErrorMessage, isXPath = false) {
   const errorElement = await findElementWithWait(driver, fieldCssSelectorOrXPath, isXPath);
   const actualErrorMessage = await errorElement.getText();
   assert.strictEqual(actualErrorMessage, expectedErrorMessage, `Expected: '${expectedErrorMessage}', but got: '${actualErrorMessage}'`);
}

// Function to log in a user
export async function login(driver, email, password) {
   await fillInputField(driver, '.login-input-field', email);
   await fillInputField(driver, '.password-container .login-input-field', password);
   await submitForm(driver, '.submit-btn');
   const dropdown = await findElementWithWait(driver, '.dropdown-toggle');
   assert.ok(dropdown, 'Login successful, dropdown toggle found.');
}

// Function to log out the user
export async function logout(driver) {
   const dropdownToggle = await findElementWithWait(driver, '.dropdown-toggle');
   await dropdownToggle.click();
   await driver.sleep(1000);  // Wait for dropdown animation
   const logoutBtn = await findElementWithWait(driver, '.dropdown-item:nth-child(2)');
   await logoutBtn.click();
   const loginUrl = await driver.getCurrentUrl();
   assert.strictEqual(loginUrl, 'http://localhost:5173/login', 'Successfully logged out and returned to the login page.');
}


// Function to delete a user from the backend
export async function deleteUser(email, authToken) {
   try {
      const response = await axios.delete(`http://localhost:5050/user/email/${email}`, {
         headers: { Authorization: `Bearer ${authToken}` }
      });
      assert.strictEqual(response.status, 200, 'User was not deleted successfully');
   } catch (error) {
      console.error(`Failed to delete user: ${error.response ? error.response.data : error.message}`);
   }
}

// Function to toggle the sidebar if it's not visible
export async function toggleSidebarIfNotVisible(driver) {
   const sidebarToggle = await findElementWithWait(driver, '.sidebar-toggle');
   await driver.wait(until.elementIsVisible(sidebarToggle), 10000);
   try {
      await driver.findElement(By.css('.nav-container.open'));  // If sidebar is open, return
   } catch {
      await sidebarToggle.click();  // If sidebar is not open, click to open it
   }
   await driver.sleep(1000);  // Small delay to ensure the sidebar opens
}

