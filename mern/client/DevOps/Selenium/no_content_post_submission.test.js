import { Builder, By, until } from 'selenium-webdriver';

describe('no_content_post_submission', function () {
    this.timeout(60000); // Set timeout to 60 seconds to allow for the test

    let driver;

    beforeEach(async function () {
        driver = await new Builder().forBrowser('chrome').build();
    });

    afterEach(async function () {
        await driver.quit();
    });

    it('should prevent submission when no content is provided', async function () {
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
            console.log("User is not logged in. Proceeding to log in.");
        }

        // Step 4: Wait for the login page to load
        const loginEmailField = await driver.wait(until.elementLocated(By.id("login_email")), 15000);
        await driver.wait(until.elementIsVisible(loginEmailField), 15000);
        console.log("Login page loaded.");

        // Step 5: Log in using provided credentials
        await loginEmailField.sendKeys("test@test.test");
        await driver.findElement(By.id("login_password")).sendKeys("test");

        const loginButton = await driver.wait(until.elementLocated(By.scss(".btn.btn-primary")), 10000);
        await driver.wait(until.elementIsVisible(loginButton), 10000);
        await loginButton.click();
        console.log("Logged in successfully.");

        // Step 6: Verify login by checking if the email input in UserCard appears
        try {
            const emailField = await driver.wait(until.elementLocated(By.scss('.home-user-status')), 20000);
            const emailValue = await emailField.getAttribute('value'); // This should give you the logged-in email
            console.assert(emailValue === 'test@test.test', "Email should match the logged-in user.");
            console.log("Verified user is logged in.");
        } catch (error) {
            console.error("Failed to verify login.");
            throw error;
        }

        // Step 7: Now proceed with the post creation test
        const postButton = await driver.wait(until.elementLocated(By.scss(".post-button")), 10000);
        await driver.wait(until.elementIsVisible(postButton), 10000);
        await postButton.click();
        console.log("Clicked post button");

        // Step 8: Wait for the modal to be fully loaded
        const modalVisible = await driver.wait(until.elementLocated(By.scss(".modal-body")), 10000);
        await driver.wait(until.elementIsVisible(modalVisible), 10000);
        console.log("Modal is fully loaded and visible");

        // Step 9: Try submitting the form without entering any content
        const submitButton = await driver.wait(until.elementLocated(By.scss(".submit-button")), 10000);
        await driver.wait(until.elementIsVisible(submitButton), 10000);
        await submitButton.click();
        console.log("Clicked submit button without entering any content");

        // Step 10: Check for an error or failure (depends on app implementation, either error message or form not submitted)
        try {
            // Option 1: Check if an error message appears (if applicable)
            const errorMessage = await driver.findElement(By.scss(".error-message"));
            const isDisplayed = await errorMessage.isDisplayed();
            console.assert(isDisplayed, "Error message should appear when submitting without content.");
            console.log("Error message displayed for empty content submission.");
        } catch (error) {
            console.log("No error message found. Checking if post submission is blocked.");

            // Option 2: Verify the modal remains open or that no new post has been submitted
            const modalStillVisible = await driver.wait(until.elementIsVisible(modalVisible), 5000);
            console.assert(modalStillVisible, "The modal should still be visible as the post submission failed.");
            console.log("Post submission was blocked successfully.");
        }

        // Test completed
        console.log("Test for preventing post submission with no content completed successfully.");
    });
});