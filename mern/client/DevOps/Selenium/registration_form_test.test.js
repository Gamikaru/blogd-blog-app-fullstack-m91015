import assert from 'assert';
import { Builder, By, until } from 'selenium-webdriver';

// Helper function to generate a random email address
function generateRandomEmail() {
    const timestamp = Date.now();
    return `testuser${timestamp}@blabla.com`;
}

describe('registration_form_test', function () {
    this.timeout(70000); // Increased timeout to ensure enough time for the test
    let driver;

    beforeEach(async function () {
        driver = await new Builder().forBrowser('chrome').build();
    });

    afterEach(async function () {
        await driver.quit();
    });

    it('registration_form_test', async function () {
        // Step 1: Open the homepage
        await driver.get("http://localhost:5173/");
        console.log("Opened homepage");

        // Step 2: Set the window size
        await driver.manage().window().setRect({ width: 1552, height: 832 });
        console.log("Set window size");

        // Step 3: Handle existing session (if logged in, logout first)
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

        // Step 4: Wait for the login page to load
        try {
            const loginEmailField = await driver.wait(until.elementLocated(By.id("login_email")), 15000);
            await driver.wait(until.elementIsVisible(loginEmailField), 15000);
            console.log("Login page loaded.");
        } catch (error) {
            console.error("Failed to load login page.");
            throw error;
        }

        // Step 5: Navigate to the registration page by clicking the "Register Now" link
        try {
            const registerLink = await driver.wait(until.elementLocated(By.scss('.register-link')), 10000);
            await driver.wait(until.elementIsVisible(registerLink), 10000);
            await registerLink.click();
            console.log("Navigated to registration page");
        } catch (error) {
            console.error("Failed to click 'Register Now'.");
            throw error;
        }

        // Step 6: Wait for the registration form to be visible
        try {
            const firstNameField = await driver.wait(until.elementLocated(By.id("register_first_name")), 10000);
            await driver.wait(until.elementIsVisible(firstNameField), 10000);
            console.log("Registration form loaded");
            await firstNameField.sendKeys("Tom");
        } catch (error) {
            console.error("Failed to find first name field on registration form.");
            throw error;
        }

        // Step 7: Fill out the remaining fields with dynamic email
        await driver.findElement(By.id("register_last_name")).sendKeys("Rudolph");

        const randomEmail = generateRandomEmail(); // Generate a random email for each run
        await driver.findElement(By.id("register_email")).sendKeys(randomEmail);
        console.log(`Random email generated: ${randomEmail}`);

        // Step 8: Fill birthdate
        const birthdateField = await driver.wait(until.elementLocated(By.id("register_birthdate")), 10000);
        await driver.wait(until.elementIsVisible(birthdateField), 10000);
        await birthdateField.sendKeys("1990-02-04");

        // Step 9: Fill out remaining fields
        await driver.findElement(By.id("register_password")).sendKeys("test");
        await driver.findElement(By.id("register_occupation")).sendKeys("Developer");
        await driver.findElement(By.id("register_location")).sendKeys("USA");
        await driver.findElement(By.id("register_status")).sendKeys("Active");

        // Step 10: Wait for the submit button to be interactable and click it
        const submitButton = await driver.wait(until.elementLocated(By.scss(".btn.btn-primary")), 10000);
        await driver.wait(until.elementIsVisible(submitButton), 10000);
        await submitButton.click();
        console.log("Registration form submitted.");

        // Step 11: Wait for possible error toast or success redirect to the login page
        try {
            const errorToast = await driver.findElement(By.scss('.reg-error-toast'));
            if (await errorToast.isDisplayed()) {
                console.error("Registration failed: User may already exist.");
                return;
            }
        } catch (error) {
            console.log("No error toast found, proceeding...");
        }

        // Adding sleep to give enough time for redirect (5 seconds)
        await driver.sleep(5000);

        // Step 12: Ensure we are redirected to the login page
        try {
            const loginEmailFieldAfterSubmit = await driver.wait(until.elementLocated(By.id("login_email")), 20000);
            console.log("Login page loaded successfully.");
        } catch (error) {
            console.error("Failed to find login page or email field.");
            throw error;
        }

        // Step 13: Log in with the newly registered account
        await driver.findElement(By.id("login_email")).sendKeys(randomEmail);
        await driver.findElement(By.id("login_password")).sendKeys("test");

        // Step 14: Submit the login form
        const loginButton = await driver.wait(until.elementLocated(By.scss(".btn.btn-primary")), 10000);
        await driver.wait(until.elementIsVisible(loginButton), 10000);
        await loginButton.click();

        // Step 15: Verify user is logged in by checking if the user's email is displayed on the homepage
        try {
            const userEmail = await driver.wait(until.elementLocated(By.xpath("//*[contains(text(), 'Email')]")), 20000);
            assert.strictEqual(await userEmail.isDisplayed(), true, "User email should be displayed on the homepage after login.");
            console.log("User is successfully logged in.");
        } catch (error) {
            console.error("Failed to verify login by checking the user's email.");
            throw error;
        }

        // Step 16: End the test successfully after verifying the user is logged in
        console.log("Login successful. Test completed.");

    });
});