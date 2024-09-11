import assert from 'assert';
import { Builder, By, until } from 'selenium-webdriver';

// Helper function to generate a random sentence with 15 random words
function generateRandomPost() {
    const words = [
        "cat", "dog", "penguin", "laptop", "whisper", "jelly", "banana", "rocket", "shark", "moon",
        "socks", "potato", "hula", "unicorn", "piano", "trombone", "puzzle", "cloud", "ocean", "sunshine",
        "tiger", "burrito", "coffee", "book", "spaceship", "alien", "pancake", "dinosaur", "lamp", "whale",
        "the", "a", "an", "one", "then", "also"
    ];

    let randomSentence = [];
    for (let i = 0; i < 15; i++) {
        const randomIndex = Math.floor(Math.random() * words.length);
        randomSentence.push(words[randomIndex]);
    }
    return randomSentence.join(' ') + '.';
}

describe('create_post_form_submission', function () {
    this.timeout(90000); // Increased timeout for slower load times
    let driver;

    beforeEach(async function () {
        driver = await new Builder().forBrowser('chrome').build();
    });

    afterEach(async function () {
        await driver.quit();
    });

    it('create_post_form_validation', async function () {
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

        const loginButton = await driver.wait(until.elementLocated(By.css(".btn.btn-primary")), 10000);
        await driver.wait(until.elementIsVisible(loginButton), 10000);
        await loginButton.click();
        console.log("Logged in successfully.");

        // Step 6: Verify login by checking if the email input in UserCard appears
        try {
            const emailField = await driver.wait(until.elementLocated(By.css('.home-user-status')), 20000);
            const emailValue = await emailField.getAttribute('value');
            assert.strictEqual(emailValue, 'test@test.test', "Email should match the logged-in user.");
            console.log("Verified user is logged in.");
        } catch (error) {
            console.error("Failed to verify login.");
            throw error;
        }

        // Step 7: Now proceed with the post creation test
        const postButton = await driver.wait(until.elementLocated(By.css(".post-button")), 10000);
        await driver.wait(until.elementIsVisible(postButton), 10000);
        await postButton.click();
        console.log("Clicked post button");

        // Step 8: Wait for the modal to be fully loaded
        const modalVisible = await driver.wait(until.elementLocated(By.css(".modal-body")), 10000);
        await driver.wait(until.elementIsVisible(modalVisible), 10000);
        console.log("Modal is fully loaded and visible");

        // Step 9: Click on the post content input field to ensure it is focused
        const postContentField = await driver.wait(until.elementLocated(By.id("postContent")), 10000);
        await driver.wait(until.elementIsVisible(postContentField), 10000);
        await postContentField.click();
        console.log("Clicked post content field");

        // Step 10: Clear the text field before entering new content
        await postContentField.clear();

        // Step 11: Enter a randomly generated post
        const postContent = generateRandomPost();
        await postContentField.sendKeys(postContent);
        console.log(`Entered post content: ${postContent}`);

        // Step 12: Submit the post
        const submitButton = await driver.wait(until.elementLocated(By.css(".submit-button")), 10000);
        await driver.wait(until.elementIsVisible(submitButton), 10000);
        await submitButton.click();
        console.log("Submitted the post");

        // Step 13: Sleep for 2 seconds to give time for the post to be saved and displayed
        await driver.sleep(2000);

        // Step 14: Refresh the page to ensure the new post is rendered
        await driver.navigate().refresh();
        console.log("Page refreshed");

        // Step 15: Add extra wait to ensure the new post is rendered after refresh
        await driver.sleep(3000);

        // Step 16: Verify the newly created post appears in the recent posts section
        const recentPost = await driver.wait(until.elementLocated(By.xpath(`//*[contains(text(), "${postContent}")]`)), 20000);
        const isDisplayed = await recentPost.isDisplayed();
        assert.strictEqual(isDisplayed, true, "The new post should be displayed in the recent posts section.");
        console.log("Verified the new post is displayed");

        // Test completed
        console.log("Test completed successfully.");
    });
});
