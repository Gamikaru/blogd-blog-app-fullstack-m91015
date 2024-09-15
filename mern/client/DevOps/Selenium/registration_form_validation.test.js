import assert from 'assert';
import { Builder, By, until } from 'selenium-webdriver';

describe('registration_form_validation', function () {
    this.timeout(90000); // Increased timeout to ensure enough time for the test
    let driver;

    beforeEach(async function () {
        driver = await new Builder().forBrowser('chrome').build();
    });

    afterEach(async function () {
        await driver.quit();
    });

    it('should validate registration form and check for error alerts', async function () {
        // Step 1: Open the homepage
        await driver.get("http://localhost:5173/");
        console.log("Opened homepage");

        // Step 2: Set the window size
        await driver.manage().window().setRect({ width: 1552, height: 832 });
        console.log("Set window size");

        // Step 3: Handle existing session (if logged in, log out first)
        try {
            const dropdown = await driver.findElement(By.id('dropdown'));
            await driver.wait(until.elementIsVisible(dropdown), 10000);
            await dropdown.click();
            console.log("Clicked dropdown");

            const logoutLink = await driver.findElement(By.linkText('Logout'));
            await driver.wait(until.elementIsVisible(logoutLink), 10000);
            await logoutLink.click();
            console.log("User logged out successfully.");
        } catch (error) {
            console.log("User is not logged in. Proceeding to register.");
        }

        // Step 4: Navigate to the registration page by clicking the "Register Now" link
        const registerLink = await driver.wait(until.elementLocated(By.scss('.register-link')), 10000);
        await driver.wait(until.elementIsVisible(registerLink), 10000);
        await registerLink.click();
        console.log("Navigated to registration page");

        // Step 5: Submit the registration form with empty fields to test validation
        const submitButton = await driver.wait(until.elementLocated(By.scss(".btn.btn-primary")), 10000);
        await driver.wait(until.elementIsVisible(submitButton), 10000);
        await submitButton.click();
        console.log("Clicked submit with empty fields");

        // Step 6: Check for validation error toast
        const errorToast = await driver.wait(until.elementLocated(By.scss('.reg-error-toast')), 10000);
        await driver.wait(until.elementIsVisible(errorToast), 5000);
        const errorToastDisplayed = await errorToast.isDisplayed();
        assert.strictEqual(errorToastDisplayed, true, "Error toast should be displayed for invalid registration attempt.");
        console.log("Validation error toast displayed successfully.");

        // Step 7: Test invalid email validation
        await driver.findElement(By.id("register_first_name")).sendKeys("Tom");
        await driver.findElement(By.id("register_last_name")).sendKeys("Rudolph");
        await driver.findElement(By.id("register_email")).sendKeys("invalid-email"); // Invalid email format
        await driver.findElement(By.id("register_password")).sendKeys("test");
        await driver.findElement(By.id("register_birthdate")).sendKeys("1990-02-04");
        await driver.findElement(By.id("register_occupation")).sendKeys("Developer");
        await driver.findElement(By.id("register_location")).sendKeys("USA");
        await driver.findElement(By.id("register_status")).sendKeys("Active");

        const submitButtonAfterFill = await driver.wait(until.elementLocated(By.scss(".btn.btn-primary")), 10000);
        await submitButtonAfterFill.click();
        console.log("Clicked submit with invalid email");

        // Step 8: Check for validation error toast again for invalid email
        const invalidEmailErrorToast = await driver.wait(until.elementLocated(By.scss('.reg-error-toast')), 10000);
        await driver.wait(until.elementIsVisible(invalidEmailErrorToast), 5000);
        const invalidEmailErrorDisplayed = await invalidEmailErrorToast.isDisplayed();
        assert.strictEqual(invalidEmailErrorDisplayed, true, "Error toast should be displayed for invalid email.");
        console.log("Invalid email format error toast displayed successfully.");

        // Step 9: Fill valid email and resubmit
        await driver.findElement(By.id("register_email")).clear();
        const validEmail = `testuser${Date.now()}@example.com`;
        await driver.findElement(By.id("register_email")).sendKeys(validEmail);

        const submitButtonAfterEmail = await driver.wait(until.elementLocated(By.scss(".btn.btn-primary")), 10000);
        await submitButtonAfterEmail.click();
        console.log(`Resubmitted with valid email: ${validEmail}`);

        await driver.sleep(5000); // Adding sleep to give enough time for redirect

        // Step 10: Ensure we are redirected to the login page after successful registration
        const loginEmailFieldAfterSubmit = await driver.wait(until.elementLocated(By.id("login_email")), 20000);
        console.log("Login page loaded successfully after registration.");

        // Step 11: Click the "Register Now" button again to return to the registration page
        const registerLinkAfterSubmit = await driver.wait(until.elementLocated(By.scss('.register-link')), 10000);
        await driver.wait(until.elementIsVisible(registerLinkAfterSubmit), 10000);
        await registerLinkAfterSubmit.click();
        console.log("Navigated to registration page again for pre-existing email test");

        // Step 12: Test registration with an existing email
        await driver.findElement(By.id("register_first_name")).clear();
        await driver.findElement(By.id("register_last_name")).clear();
        await driver.findElement(By.id("register_email")).clear();
        await driver.findElement(By.id("register_password")).clear();

        // Fill form with existing email (e.g., test@test.test)
        await driver.findElement(By.id("register_first_name")).sendKeys("John");
        await driver.findElement(By.id("register_last_name")).sendKeys("Doe");
        await driver.findElement(By.id("register_email")).sendKeys("test@test.test"); // Pre-existing email
        await driver.findElement(By.id("register_password")).sendKeys("testpass");
        await driver.findElement(By.id("register_birthdate")).sendKeys("1980-01-01");
        await driver.findElement(By.id("register_occupation")).sendKeys("Tester");
        await driver.findElement(By.id("register_location")).sendKeys("USA");
        await driver.findElement(By.id("register_status")).sendKeys("Active");

        const submitPreExisting = await driver.wait(until.elementLocated(By.scss(".btn.btn-primary")), 10000);
        await submitPreExisting.click();
        console.log("Clicked submit with pre-existing email");

        // Step 13: Check for validation error toast for existing user
        const existingUserErrorToast = await driver.wait(until.elementLocated(By.scss('.reg-error-toast')), 10000);
        await driver.wait(until.elementIsVisible(existingUserErrorToast), 5000);
        const existingUserErrorDisplayed = await existingUserErrorToast.isDisplayed();
        assert.strictEqual(existingUserErrorDisplayed, true, "Error toast should be displayed for existing user.");
        console.log("Existing user error toast displayed successfully.");

        // Test completed successfully
        console.log("Registration validation test completed successfully.");
    });
});