// import assert from 'assert'; // For message verification
// import fs from 'fs'; // For file operations
// import { By, until, Builder } from 'selenium-webdriver';
// import axios from 'axios'; // For API requests

// // Helper to locate elements with wait (CSS or XPath selectors)
// export async function findElementWithWait(driver, selectorOrXPath, isXPath = false, timeout = 10000) {
//    if (isXPath) {
//       return await driver.wait(until.elementLocated(By.xpath(selectorOrXPath)), timeout);
//    } else {
//       return await driver.wait(until.elementLocated(By.css(selectorOrXPath)), timeout);
//    }
// }

// // Function to fill text input fields (handles both placeholder and CSS selector)
// export async function fillInputField(driver, selectorOrPlaceholder, value) {
//    const inputField = await findElementWithWait(driver, selectorOrPlaceholder.startsWith('.')
//       ? selectorOrPlaceholder
//       : `input[placeholder="${selectorOrPlaceholder}"]`);

//    await inputField.clear();
//    await inputField.sendKeys(value);
//    await driver.sleep(500);
// }

// // Helper to initialize and teardown the WebDriver for tests
// export function initializeTestDriver() {
//    let driver;

//    beforeEach(async function () {
//       driver = await new Builder().forBrowser('chrome').build(); // Initialize WebDriver
//       await driver.manage().window().setRect({ width: 1552, height: 832 });
//    });

//    afterEach(async function () {
//       if (driver) {
//          await driver.quit(); // Quit WebDriver after test
//       }
//    });

//    return () => driver;  // Return a function to get the driver instance
// }

// // Function to select an option from a dropdown (handles CSS selectors)
// export async function selectDropdownOption(driver, dropdownCss, optionText) {
//    const dropdown = await findElementWithWait(driver, dropdownCss);
//    await dropdown.click();  // Open the dropdown
//    await driver.sleep(500);
//    const option = await dropdown.findElement(By.xpath(`//option[. = '${optionText}']`)); // Select by visible text
//    await option.click();
//    await driver.sleep(500);
// }

// // Helper to randomly select a location from a predefined list
// export async function selectRandomLocation(driver, dropdownCss) {
//    const capitalCities = [
//       "Washington, D.C.", "Ottawa", "Mexico City", "London", "Paris", "Berlin",
//       "Rome", "Madrid", "Tokyo", "Beijing", "Canberra", "Brasília", "Moscow",
//       "New Delhi", "Cairo", "Buenos Aires", "Ankara", "Seoul", "Bangkok", "Jakarta"
//    ];
//    const randomCity = capitalCities[Math.floor(Math.random() * capitalCities.length)];
//    await selectDropdownOption(driver, dropdownCss, randomCity);
// }

// // Function to fill in the date picker (handles both placeholder and CSS selector)
// export async function fillDatePicker(driver, selectorOrPlaceholder, dateValue) {
//    const dateField = await findElementWithWait(driver, selectorOrPlaceholder.startsWith('.')
//       ? selectorOrPlaceholder
//       : `input[placeholder="${selectorOrPlaceholder}"]`);

//    const formattedDate = `${dateValue.slice(4, 8)}-${dateValue.slice(0, 2)}-${dateValue.slice(2, 4)}`;
//    await dateField.clear();
//    await dateField.sendKeys(dateValue);  // Send keys as MMDDYYYY

//    // Validate that the date was correctly formatted and entered
//    const enteredDate = await dateField.getAttribute('value');
//    if (enteredDate !== formattedDate) {
//       throw new Error(`Expected date: ${formattedDate}, but got: ${enteredDate}`);
//    }
//    await driver.sleep(500);
// }

// // Function to submit the form
// export async function submitForm(driver) {
//    const submitBtn = await findElementWithWait(driver, '.register-submit-btn');
//    await submitBtn.click();
//    await driver.sleep(2000);  // Adding sleep to ensure the toast is rendered
// }

// // Function to verify the toast message
// export async function verifyToastMessage(driver, expectedMessage) {
//    try {
//       const toast = await findElementWithWait(driver, '.custom-toast-body');
//       const toastMessage = await toast.getText();
//       assert.strictEqual(toastMessage, expectedMessage, `Expected: ${expectedMessage}, but got: ${toastMessage}`);
//    } catch (error) {
//       throw new Error(`Failed to verify toast message: ${error.message}`);
//    }
// }

// // Function to close the toast notification if it exists
// export async function closeToastIfVisible(driver) {
//    try {
//       const toastCloseButton = await driver.findElement(By.css('.custom-toast .close-button'));
//       if (await toastCloseButton.isDisplayed()) {
//          await toastCloseButton.click();
//       }
//    } catch (error) {
//       // No visible toast to close
//    }
// }

// // Function to take screenshots (optional for debugging)
// export async function takeScreenshot(driver, testName) {
//    const screenshot = await driver.takeScreenshot();
//    const screenshotPath = `DevOps/screenshots/${testName}.png`;
//    fs.writeFileSync(screenshotPath, screenshot, 'base64');
// }

// // Function to verify an inline error message for a field
// export async function verifyInlineError(driver, fieldCssSelectorOrXPath, expectedErrorMessage, isXPath = false) {
//    try {
//       const errorElement = await findElementWithWait(driver, fieldCssSelectorOrXPath, isXPath);
//       const actualErrorMessage = await errorElement.getText();

//       // Assert the error message matches the expected value
//       assert.strictEqual(actualErrorMessage, expectedErrorMessage, `Expected: '${expectedErrorMessage}', but got: '${actualErrorMessage}'`);
//    } catch (error) {
//       throw new Error(`Error verification failed: ${error.message}`);
//    }
// }

// // Helper to register a new user
// export async function registerUser(driver, userData) {
//    const { firstName, lastName, email, password, birthDate, location, occupation } = userData;
//    await fillInputField(driver, '.register-first-name-input', firstName);
//    await fillInputField(driver, '.register-last-name-input', lastName);
//    await fillInputField(driver, '.register-email-input', email);
//    await fillInputField(driver, '.register-password-input', password);
//    await fillInputField(driver, '.register-confirm-password-input', password);
//    await fillDatePicker(driver, '.register-birthdate-input', birthDate);
//    await selectDropdownOption(driver, '.register-location-select', location);
//    await fillInputField(driver, '.register-occupation-input', occupation);

//    await submitForm(driver);
//    await verifyToastMessage(driver, 'User registered successfully');
// }

// // Helper to delete the user from the backend
// export async function deleteUser(email, authToken) {
//    try {
//       const response = await axios.delete(`http://localhost:5050/user/email/${email}`, {
//          headers: {
//             Authorization: `Bearer ${authToken}`,
//          },
//       });
//       assert.strictEqual(response.status, 200, 'User was not deleted successfully');
//    } catch (error) {
//       console.error(`Failed to delete user: ${error.response ? error.response.data : error.message}`);
//    }
// }

// // Function to log in a user and return the authentication token
// export async function loginUser(driver, email, password) {
//    await driver.get('http://localhost:5173/login');
//    await fillInputField(driver, '.login-input-field', email);
//    await fillInputField(driver, '.password-container .login-input-field', password);

//    const submitBtn = await findElementWithWait(driver, '.submit-btn');
//    await submitBtn.click();

//    // Verify login success by checking dropdown visibility
//    try {
//       const dropdown = await findElementWithWait(driver, '.dropdown-toggle');
//       assert.ok(dropdown, 'Login successful, dropdown found');
//    } catch (error) {
//       throw new Error('Login failed');
//    }

//    const authToken = await driver.executeScript('return localStorage.getItem("authToken");');
//    if (!authToken) {
//       throw new Error('Authentication token not found');
//    }
//    return authToken;
// }
// // Function to log out the user
// export async function logout(driver) {
//    const dropdownToggle = await findElementWithWait(driver, '.dropdown-toggle');
//    await dropdownToggle.click();
//    await driver.sleep(1000); // Wait for dropdown animation

//    const logoutBtn = await findElementWithWait(driver, '.dropdown-item:nth-child(2)');
//    await logoutBtn.click();

//    // Confirm logout by checking if we are back at the login page
//    const loginUrl = await driver.getCurrentUrl();
//    assert.strictEqual(loginUrl, 'http://localhost:5173/login', 'Successfully logged out and returned to the login page.');
// }
// // Function to log in a user
// export async function login(driver, email, password) {
//    await fillInputField(driver, '.login-input-field', email);
//    await fillInputField(driver, '.password-container .login-input-field', password);

//    const submitBtn = await findElementWithWait(driver, '.submit-btn');
//    await submitBtn.click();
// }

// // Function to verify login success by checking if Navbar is visible
// export async function verifyLoginSuccess(driver) {
//    try {
//       // Check for the existence of the Navbar after successful login
//       const navbar = await findElementWithWait(driver, '.nav-header');
//       assert.ok(navbar, 'Login successful, Navbar is visible.');
//    } catch (error) {
//       throw new Error('Login failed or Navbar not found.');
//    }
// }
