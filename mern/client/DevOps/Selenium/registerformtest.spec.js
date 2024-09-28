// import assert from 'assert';
// import fs from 'fs';
// import path from 'path';
// import { Builder, By, until } from 'selenium-webdriver';

// // Function to take screenshots
// async function takeScreenshot(driver, testName) {
//    const screenshot = await driver.takeScreenshot();
//    const screenshotPath = path.resolve("DevOps/screenshots", `${testName}.png`);
//    fs.writeFileSync(screenshotPath, screenshot, 'base64');
//    console.log(`Screenshot saved: ${screenshotPath}`);
// }

// // Function to log form field values
// async function logFieldValues(driver) {
//    const firstName = await driver.findElement(By.css('.register-first-name-input')).getAttribute('value');
//    const lastName = await driver.findElement(By.css('.register-last-name-input')).getAttribute('value');
//    const email = await driver.findElement(By.css('.register-email-input')).getAttribute('value');
//    const password = await driver.findElement(By.css('.register-password-input')).getAttribute('value');
//    const confirmPassword = await driver.findElement(By.css('.register-confirm-password-input')).getAttribute('value'); // Added confirm password
//    const birthDate = await driver.findElement(By.css('.register-birthdate-input')).getAttribute('value');
//    const location = await driver.findElement(By.css('.register-location-select')).getAttribute('value');
//    const occupation = await driver.findElement(By.css('.register-occupation-input')).getAttribute('value');
//    console.log(`Form Field Values: First Name = ${firstName}, Last Name = ${lastName}, Email = ${email}, Password = ${password}, Confirm Password = ${confirmPassword}, Birth Date = ${birthDate}, Location = ${location}, Occupation = ${occupation}`);
// }

// // Function to close the toast notification if it exists
// async function closeToastIfVisible(driver) {
//    try {
//       const closeButton = await driver.findElement(By.css('.close-button'));
//       if (await closeButton.isDisplayed()) {
//          await closeButton.click();
//          console.log("Toast closed successfully.");
//       }
//    } catch (error) {
//       console.log("No visible toast to close.");
//    }
// }

// describe('Register Form Tests', function () {
//    this.timeout(60000); // Increased timeout for the test suite
//    let driver;

//    // Set up the browser before each test
//    beforeEach(async function () {
//       driver = new Builder().forBrowser('chrome').build();
//       await driver.manage().window().setRect({ width: 1552, height: 832 });
//       console.log('Browser setup completed');
//    });

//    // Clean up the browser after each test
//    afterEach(async function () {
//       await driver.quit();
//       console.log('Browser closed');
//    });

//    // 1. Test for validation errors when no fields are filled
//    it('should show validation errors for empty fields', async function () {
//       console.log('Test: Validation for empty fields');
//       await driver.get('http://localhost:5173/login');

//       // Navigate to the register form
//       const registerLink = await driver.wait(until.elementLocated(By.css('.register-link')), 10000);
//       await registerLink.click();
//       console.log('Navigated to register form');

//       // Attempt to submit without filling in the fields
//       const submitBtn = await driver.wait(until.elementLocated(By.css('.register-submit-btn')), 10000);
//       await submitBtn.click();
//       console.log('Submit button clicked without filling fields');

//       // Adding sleep to ensure toast is rendered
//       await driver.sleep(1000);

//       // Close the toast if visible
//       await closeToastIfVisible(driver);

//       // Take screenshot before checking the toast
//       await takeScreenshot(driver, 'validation-errors-empty-fields');

//       // Validate the error message
//       const toast = await driver.wait(until.elementLocated(By.css('.custom-toast-body')), 15000);
//       await driver.wait(until.elementIsVisible(toast), 15000);  // Ensuring the toast is visible
//       const toastMessage = await toast.getText();
//       console.log(`Toast Message: ${toastMessage}`);
//       assert.strictEqual(toastMessage, 'All fields are required.', 'Validation error toast displayed correctly');
//    });

//    it('should show an error for pre-existing email', async function () {
//       console.log('Test: Pre-existing email error');

//       // 1. Open the login page
//       await driver.get('http://localhost:5173/login');
//       console.log('Login page opened');

//       // 2. Click the "Sign up now!" link to open the register modal
//       const registerLink = await driver.wait(until.elementLocated(By.css('.register-link')), 10000);
//       await registerLink.click();
//       console.log('Navigated to register form via Sign up link');

//       // 3. Fill in the first name
//       const firstNameField = await driver.wait(until.elementLocated(By.css('.register-first-name-input')), 10000);
//       await firstNameField.clear();
//       await firstNameField.sendKeys('Test');
//       console.log('First Name entered: Test');
//       await driver.sleep(500);

//       // 4. Fill in the last name
//       const lastNameField = await driver.findElement(By.css('.register-last-name-input'));
//       await lastNameField.clear();
//       await lastNameField.sendKeys('User');
//       console.log('Last Name entered: User');
//       await driver.sleep(500);

//       // 5. Fill in the password
//       const passwordField = await driver.findElement(By.css('.register-password-input'));
//       await passwordField.clear();
//       await passwordField.sendKeys('TestPassword123!');
//       console.log('Password entered: TestPassword123!');
//       await driver.sleep(500);

//       // 6. Fill in the confirm password
//       const confirmPasswordField = await driver.findElement(By.css('.register-confirm-password-input'));
//       await confirmPasswordField.clear();
//       await confirmPasswordField.sendKeys('TestPassword123!');
//       console.log('Confirm Password entered: TestPassword123!');
//       await driver.sleep(500);

//       // 7. Fill in the email (pre-existing)
//       const emailField = await driver.findElement(By.css('.register-email-input'));
//       await emailField.clear();
//       await emailField.sendKeys('gavrielmrudolph@gmail.com');
//       console.log('Email entered: gavrielmrudolph@gmail.com');
//       await driver.sleep(1000);

//       // Verify the value of the email field after sending keys
//       const emailValue = await emailField.getAttribute('value');
//       console.log(`Email field contains: ${emailValue}`);

//       if (emailValue !== 'gavrielmrudolph@gmail.com') {
//          console.error('Email was not correctly entered.');
//          throw new Error('Email field did not receive the correct input.');
//       }

//       // 8. Fill in the birth date using the correct YYYY-MM-DD format
//       const birthDateField = await driver.findElement(By.css('.register-birthdate-input'));
//       await birthDateField.clear();
//       await birthDateField.sendKeys('12241996');  // Correct format: YYYY-MM-DD
//       console.log('Birth Date entered: 1996-12-24');
//       await driver.sleep(500);

//       // Validate if the date is correctly entered
//       const enteredDate = await birthDateField.getAttribute('value');
//       if (enteredDate !== '1996-12-24') {
//          console.error('Birth date was not correctly entered.');
//          throw new Error('Birth date field did not receive the correct input.');
//       }

//       // 9. Select location from the dropdown
//       try {
//          const locationDropdown = await driver.wait(until.elementLocated(By.css('.select-control')), 10000);
//          await locationDropdown.click();  // Open the dropdown
//          console.log('Location dropdown opened');
//          await driver.sleep(500);

//          await locationDropdown.findElement(By.xpath("//option[. = 'Tokyo']")).click();  // Choose "Tokyo"
//          console.log('Location selected: Tokyo');
//          await driver.sleep(500);
//       } catch (error) {
//          console.error('Error selecting location:', error);
//          throw error;
//       }

//       // 10. Fill in the occupation
//       try {
//          const occupationField = await driver.wait(until.elementLocated(By.css('.register-occupation-input')), 10000);
//          await occupationField.clear();
//          await occupationField.sendKeys('Software Developer');
//          console.log('Occupation entered: Software Developer');
//          await driver.sleep(500);
//       } catch (error) {
//          console.error('Error entering occupation:', error);
//          throw error;
//       }

//       // 11. Submit the form
//       const submitBtn = await driver.findElement(By.css('.register-submit-btn'));
//       await submitBtn.click();
//       console.log('Submit button clicked for pre-existing email');

//       // Adding sleep to ensure the toast is rendered
//       await driver.sleep(2000);

//       // 12. Capture the toast message
//       try {
//          const toast = await driver.wait(until.elementLocated(By.css('.custom-toast-body')), 15000);
//          await driver.wait(until.elementIsVisible(toast), 15000);  // Ensuring the toast is visible
//          const toastMessage = await toast.getText();
//          console.log(`Toast Message: ${toastMessage}`);

//          // 13. Assert the toast message
//          assert.strictEqual(toastMessage, 'Email already registered.', 'Existing email error toast displayed correctly');
//       } catch (error) {
//          console.error('Error capturing toast message:', error);
//          throw error;
//       }

//       // 14. Close the toast if visible
//       await closeToastIfVisible(driver);

//       // 15. Take a screenshot after form submission
//       await takeScreenshot(driver, 'pre-existing-email-error');
//    });




//    // 3. Test for invalid email format error
//    it('should show an error for invalid email format', async function () {
//       console.log('Test: Invalid email format error');
//       await driver.get('http://localhost:5173/login');

//       const registerLink = await driver.wait(until.elementLocated(By.css('.register-link')), 10000);
//       await registerLink.click();
//       console.log('Navigated to register form');

//       // Fill in the first name
//       const firstNameField = await driver.wait(until.elementLocated(By.css('input[placeholder="Enter your first name"]')), 10000);
//       await firstNameField.sendKeys('Test User');
//       console.log('First Name entered: Test User');
//       await driver.sleep(500);

//       // Fill in an invalid email
//       const emailField = await driver.findElement(By.css('input[placeholder="Enter your email"]'));
//       await emailField.sendKeys('invalid-email.com');
//       console.log('Invalid Email entered: invalid-email.com');
//       await driver.sleep(500);

//       // Fill in a valid password
//       const passwordField = await driver.findElement(By.css('input[placeholder="Enter your password"]'));
//       await passwordField.sendKeys('TestPassword123!');
//       console.log('Password entered: TestPassword123!');
//       await driver.sleep(500);

//       // Fill in the confirm password
//       const confirmPasswordField = await driver.findElement(By.css('input[placeholder="Confirm your password"]'));
//       await confirmPasswordField.sendKeys('TestPassword123!');
//       console.log('Confirm Password entered: TestPassword123!');
//       await driver.sleep(500);

//       // Submit the form
//       const submitBtn = await driver.findElement(By.css('.register-submit-btn'));
//       await submitBtn.click();
//       console.log('Submit button clicked for invalid email format');

//       // Adding sleep to ensure toast is rendered
//       await driver.sleep(2000);

//       // Close the toast if visible
//       await closeToastIfVisible(driver);

//       // Take a screenshot before checking the toast
//       await takeScreenshot(driver, 'invalid-email-format-error');

//       // Validate the specific toast error for invalid email
//       const toast = await driver.wait(until.elementLocated(By.css('.custom-toast-body')), 15000);
//       await driver.wait(until.elementIsVisible(toast), 15000);  // Ensuring the toast is visible
//       const toastMessage = await toast.getText();
//       console.log(`Toast Message: ${toastMessage}`);
//       assert.strictEqual(toastMessage, 'Please fill out all required fields. Also, please enter a valid email address.', 'Invalid email format error displayed correctly');
//    });


//    it('should show an error for weak password', async function () {
//       console.log('Test: Weak password error');
//       await driver.get('http://localhost:5173/login');

//       // 1. Navigate to register form
//       const registerLink = await driver.wait(until.elementLocated(By.css('.register-link')), 10000);
//       await registerLink.click();
//       console.log('Navigated to register form');

//       // 2. Fill in the first name
//       const firstNameField = await driver.wait(until.elementLocated(By.css('input[placeholder="Enter your first name"]')), 10000);
//       await firstNameField.clear();
//       await firstNameField.sendKeys('Test User');
//       console.log('First Name entered: Test User');
//       await driver.sleep(500);

//       // 3. Fill in the last name
//       const lastNameField = await driver.findElement(By.css('input[placeholder="Enter your last name"]'));
//       await lastNameField.clear();
//       await lastNameField.sendKeys('Test');
//       console.log('Last Name entered: Test');
//       await driver.sleep(500);

//       // 4. Fill in the email
//       const emailField = await driver.findElement(By.css('input[placeholder="Enter your email"]'));
//       await emailField.clear();
//       await emailField.sendKeys('test@example.com');
//       console.log('Email entered: test@example.com');
//       await driver.sleep(500);

//       // 5. Fill in a weak password (e.g., no special characters or too short)
//       const passwordField = await driver.findElement(By.css('input[placeholder="Enter your password"]'));
//       await passwordField.clear();
//       await passwordField.sendKeys('12345'); // Weak password
//       console.log('Weak Password entered: 12345');
//       await driver.sleep(500);

//       // 6. Fill in confirm password (same weak password)
//       const confirmPasswordField = await driver.findElement(By.css('input[placeholder="Confirm your password"]'));
//       await confirmPasswordField.clear();
//       await confirmPasswordField.sendKeys('12345');
//       console.log('Confirm Password entered: 12345');
//       await driver.sleep(500);

//       // 7. Fill in the birth date using the correct YYYY-MM-DD format
//       const birthDateField = await driver.findElement(By.css('input[placeholder="Enter your birth date"]'));
//       await birthDateField.clear();
//       await birthDateField.sendKeys('1996-12-24');  // Correct format
//       console.log('Birth Date entered: 1996-12-24');
//       await driver.sleep(500);

//       // 8. Select location from the dropdown
//       try {
//          const locationDropdown = await driver.wait(until.elementLocated(By.css('.register-location-select')), 10000);
//          await locationDropdown.click();  // Open the dropdown
//          console.log('Location dropdown opened');
//          await driver.sleep(500);

//          await locationDropdown.findElement(By.xpath("//option[. = 'Tokyo']")).click();  // Choose "Tokyo"
//          console.log('Location selected: Tokyo');
//          await driver.sleep(500);
//       } catch (error) {
//          console.error('Error selecting location:', error);
//          throw error;
//       }

//       // 9. Fill in the occupation
//       try {
//          const occupationField = await driver.wait(until.elementLocated(By.css('.register-occupation-input')), 10000);
//          await occupationField.clear();
//          await occupationField.sendKeys('Software Developer');
//          console.log('Occupation entered: Software Developer');
//          await driver.sleep(500);
//       } catch (error) {
//          console.error('Error entering occupation:', error);
//          throw error;
//       }

//       // 10. Submit the form
//       const submitBtn = await driver.findElement(By.css('.register-submit-btn'));
//       await submitBtn.click();
//       console.log('Submit button clicked for weak password');

//       // 11. Adding sleep to ensure toast is rendered
//       await driver.sleep(2000);

//       // 12. Close the toast if visible
//       await closeToastIfVisible(driver);

//       // 13. Take a screenshot before checking the toast
//       await takeScreenshot(driver, 'weak-password-error');

//       // 14. Validate the specific toast error for weak password
//       const toast = await driver.wait(until.elementLocated(By.css('.custom-toast-body')), 15000);
//       await driver.wait(until.elementIsVisible(toast), 15000);  // Ensuring the toast is visible
//       const toastMessage = await toast.getText();
//       console.log(`Toast Message: ${toastMessage}`);
//       assert.strictEqual(toastMessage, 'Password must be at least 8 characters long and include letters, numbers, and special characters.', 'Weak password error displayed correctly');
//    });

//    it('should show an error for password mismatch', async function () {
//       console.log('Test: Password mismatch error');
//       await driver.get('http://localhost:5173/login');
//       const registerLink = await driver.wait(until.elementLocated(By.css('.register-link')), 10000);
//       await registerLink.click();
//       console.log('Navigated to register form');

//       // Fill in the first name
//       const firstNameField = await driver.wait(until.elementLocated(By.css('input[placeholder="Enter your first name"]')), 10000);
//       await firstNameField.sendKeys('Test User');
//       console.log('First Name entered: Test User');
//       await driver.sleep(500);

//       // Fill in the email
//       const emailField = await driver.findElement(By.css('input[placeholder="Enter your email"]'));
//       await emailField.sendKeys('test@example.com');
//       console.log('Email entered: test@example.com');
//       await driver.sleep(500);

//       // Fill in a valid password
//       const passwordField = await driver.findElement(By.css('input[placeholder="Enter your password"]'));
//       await passwordField.sendKeys('TestPassword123!');
//       console.log('Password entered: TestPassword123!');
//       await driver.sleep(500);

//       // Fill in a different confirm password
//       const confirmPasswordField = await driver.findElement(By.css('input[placeholder="Confirm your password"]'));
//       await confirmPasswordField.sendKeys('DifferentPassword123!');
//       console.log('Confirm Password entered: DifferentPassword123!');
//       await driver.sleep(500);

//       // Submit the form
//       const submitBtn = await driver.findElement(By.css('.register-submit-btn'));
//       await submitBtn.click();
//       console.log('Submit button clicked for password mismatch');

//       // Adding sleep to ensure toast is rendered
//       await driver.sleep(2000);

//       // Close the toast if visible
//       await closeToastIfVisible(driver);

//       // Take a screenshot before checking the toast
//       await takeScreenshot(driver, 'password-mismatch-error');

//       // Validate the specific toast error for password mismatch
//       const toast = await driver.wait(until.elementLocated(By.css('.custom-toast-body')), 15000);
//       await driver.wait(until.elementIsVisible(toast), 15000);  // Ensuring the toast is visible
//       const toastMessage = await toast.getText();
//       console.log(`Toast Message: ${toastMessage}`);
//       assert.strictEqual(toastMessage, 'Passwords do not match', 'Password mismatch error displayed correctly');
//    });

//    it('should register successfully with valid inputs', async function () {
//       console.log('Test: Successful registration');
//       await driver.get('http://localhost:5173/login');
//       const registerLink = await driver.wait(until.elementLocated(By.css('.register-link')), 10000);
//       await registerLink.click();
//       console.log('Navigated to register form');

//       const firstNameField = await driver.wait(until.elementLocated(By.css('input[placeholder="Enter your first name"]')), 10000);
//       await firstNameField.sendKeys('Test User');
//       console.log('First Name entered: Test User');
//       await driver.sleep(500);

//       const emailField = await driver.findElement(By.css('input[placeholder="Enter your email"]'));
//       await emailField.sendKeys('newuser@example.com');
//       console.log('Email entered: newuser@example.com');
//       await driver.sleep(500);

//       const passwordField = await driver.findElement(By.css('input[placeholder="Enter your password"]'));
//       await passwordField.sendKeys('StrongPassword123');
//       console.log('Password entered: StrongPassword123');
//       await driver.sleep(500);

//       const submitBtn = await driver.findElement(By.css('.register-submit-btn'));
//       await submitBtn.click();
//       console.log('Submit button clicked for successful registration');

//       // Adding sleep to ensure toast is rendered
//       await driver.sleep(2000);

//       // Close the toast if visible
//       await closeToastIfVisible(driver);

//       // Take screenshot before checking the toast
//       await takeScreenshot(driver, 'successful-registration');

//       const successToast = await driver.wait(until.elementLocated(By.css('.custom-toast-body')), 15000);
//       await driver.wait(until.elementIsVisible(successToast), 15000);  // Ensuring the toast is visible
//       const successMessage = await successToast.getText();
//       console.log(`Toast Message: ${successMessage}`);
//       assert.strictEqual(successMessage, 'Registration successful', 'Successful registration message displayed');
//    });
// });


