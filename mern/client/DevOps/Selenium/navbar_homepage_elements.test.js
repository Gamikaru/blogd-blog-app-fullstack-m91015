import { expect } from 'chai'; // Using Chai for assertions
import fs from 'fs';
import path from 'path'; // Import path for resolving paths
import { Builder, By, until } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome.js'; // Import ChromeOptions
import edge from 'selenium-webdriver/edge.js'; // Import EdgeOptions

// Helper function to create a directory if it doesn't exist
const ensureDirectoryExistence = (filePath) => {
    const dirname = path.dirname(filePath);
    if (fs.existsSync(dirname)) {
        return true;
    }
    fs.mkdirSync(dirname, { recursive: true });
    return true;
};

// Helper function to capture screenshots on failure
const captureScreenshot = async (driver, label) => {
    const filePath = path.resolve(`DevOps/screenshots/${label}.png`);
    ensureDirectoryExistence(filePath); // Ensure directory exists
    const screenshot = await driver.takeScreenshot();
    fs.writeFileSync(filePath, screenshot, 'base64');
    console.log(`Screenshot captured: ${label}.png`);
};

// Helper function to log in before running tests
const login = async (driver) => {
    try {
        // Step 1: Open the homepage
        await driver.get("http://localhost:5173/");
        console.log("Opened homepage");

        // Step 2: Handle existing session (if logged in, logout first)
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
            console.log("User is not logged in. Proceeding to login.");
        }

        // Step 3: Wait for the login page to load
        const loginEmailField = await driver.wait(until.elementLocated(By.id("login_email")), 15000);
        await driver.wait(until.elementIsVisible(loginEmailField), 15000);
        console.log("Login page loaded.");

        // Step 4: Fill in login details and submit
        await driver.findElement(By.id("login_email")).sendKeys("test@test.test");
        await driver.findElement(By.id("login_password")).sendKeys("test");

        // Step 5: Submit the login form
        const loginButton = await driver.wait(until.elementLocated(By.css(".btn.btn-primary")), 10000);
        await driver.wait(until.elementIsVisible(loginButton), 10000);
        await loginButton.click();

        // Step 6: Verify user is logged in by checking if the user's email is displayed on the homepage
        const userEmail = await driver.wait(until.elementLocated(By.xpath("//*[contains(text(), 'Email')]")), 20000);
        expect(await userEmail.isDisplayed()).to.be.true;
        console.log("User is successfully logged in.");
    } catch (error) {
        console.error("Failed to log in:", error);
        throw error;
    }
};

describe('Navbar and Homepage Elements Test', function () {
    this.timeout(80000); // Increased timeout to 80 seconds for each test
    let driver;

    // List of browsers to test on
    const browsers = ['chrome', 'edge'];

    browsers.forEach(browser => {

        describe(`Running tests on ${browser}`, function () {

            before(async function () {
                let options;
                if (browser === 'chrome') {
                    options = new chrome.Options();
                    driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();
                } else if (browser === 'edge') {
                    options = new edge.Options();
                    driver = await new Builder().forBrowser('MicrosoftEdge').setEdgeOptions(options).build();
                }

                // Retrieve the available screen dimensions
                let screenDimensions = await driver.executeScript(() => ({
                    width: window.screen.availWidth,
                    height: window.screen.availHeight
                }));
                console.log(`Available Screen Dimensions: ${screenDimensions.width} x ${screenDimensions.height}`);

                // Set the browser window size to the available screen size
                await driver.manage().window().setRect({
                    width: screenDimensions.width,
                    height: screenDimensions.height
                });

                // Log in before running any tests
                await login(driver);
            });

            after(async function () {
                await driver.quit();
            });

            // Test different screen sizes
            const screenSizes = [
                { width: 1440, height: 900, label: 'Desktop (1440x900)' },
                { width: 1280, height: 720, label: 'Small Laptop (1280x720)' },
                { width: 1024, height: 768, label: 'Old Desktop Standard (1024x768)' },
                { width: 768, height: 1024, label: 'Tablet (768x1024)' },
                { width: 375, height: 667, label: 'Large Mobile (375x667)' }
            ];

            screenSizes.forEach(size => {
                describe(`Testing for screen size ${size.label}`, function () {

                    beforeEach(async function () {
                        console.log(`Resizing browser window to: ${size.width}x${size.height}`);
                        await driver.manage().window().setRect({ width: size.width, height: size.height });
                        await driver.get("http://localhost:5173/");
                        console.log(`Opened homepage in ${size.label}`);
                    });

                    // Test for Navbar visibility and its elements
                    it(`should display the navbar and its elements in ${size.label}`, async function () {
                        try {
                            console.log(`Checking navbar visibility for ${size.label}`);
                            const navbarElement = await driver.wait(until.elementLocated(By.css(".nav-header")), 10000);
                            const isNavbarVisible = await navbarElement.isDisplayed();
                            expect(isNavbarVisible).to.be.true;

                            console.log(`Checking logo visibility for ${size.label}`);
                            const logoElement = await driver.wait(until.elementLocated(By.css(".nav-logo-image")), 10000);
                            expect(await logoElement.isDisplayed()).to.be.true;

                            console.log(`Checking post button visibility for ${size.label}`);
                            const postButton = await driver.wait(until.elementLocated(By.css(".post-button")), 10000);
                            expect(await postButton.isDisplayed()).to.be.true;

                            if (size.width <= 768) { // Mobile-specific test
                                console.log('Testing mobile-specific elements like hamburger menu');
                                const hamburgerMenu = await driver.wait(until.elementLocated(By.css(".hamburger-menu")), 8000);
                                expect(await hamburgerMenu.isDisplayed()).to.be.true;
                            } else {
                                console.log(`Checking dropdown visibility for ${size.label}`);
                                const dropdownButton = await driver.wait(until.elementLocated(By.css("#dropdown")), 10000);
                                expect(await dropdownButton.isDisplayed()).to.be.true;
                            }
                        } catch (error) {
                            await captureScreenshot(driver, `navbar-elements-${size.label}`);
                            throw error;
                        }
                    });

                    // Test for Dropdown interactivity and visibility after click
                    it(`should interact with and display the dropdown menu in ${size.label}`, async function () {
                        try {
                            console.log(`Testing dropdown interaction for ${size.label}`);
                            const dropdownButton = await driver.wait(until.elementLocated(By.css("#dropdown")), 10000);
                            await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", dropdownButton);

                            expect(await dropdownButton.isDisplayed()).to.be.true;
                            expect(await dropdownButton.isEnabled()).to.be.true;

                            const isDropdownClickable = await driver.executeScript((element) => {
                                const rect = element.getBoundingClientRect();
                                const elementAtPosition = document.elementFromPoint(rect.left, rect.top);
                                return elementAtPosition === element;
                            }, dropdownButton);

                            if (!isDropdownClickable) throw new Error("Dropdown is obstructed and not clickable");

                            await dropdownButton.click();
                            console.log(`Dropdown clicked for ${size.label}`);

                            const accountSettings = await driver.wait(until.elementLocated(By.xpath("//a[contains(text(), 'Account Settings')]")), 10000);
                            expect(await accountSettings.isDisplayed()).to.be.true;

                            const logout = await driver.wait(until.elementLocated(By.xpath("//a[contains(text(), 'Logout')]")), 10000);
                            expect(await logout.isDisplayed()).to.be.true;

                            await dropdownButton.click(); // Close dropdown
                            console.log(`Dropdown closed for ${size.label}`);
                        } catch (error) {
                            await captureScreenshot(driver, `dropdown-menu-${size.label}`);
                            throw error;
                        }
                    });

                    // Test to ensure no element overflows
                    it(`should ensure no element overflows or is cut off in ${size.label}`, async function () {
                        try {
                            console.log(`Checking for element overflow in ${size.label}`);
                            const postButton = await driver.findElement(By.css(".post-button"));
                            const postButtonRect = await driver.executeScript("return arguments[0].getBoundingClientRect();", postButton);
                            const windowWidth = await driver.executeScript("return window.innerWidth;");
                            expect(postButtonRect.right <= windowWidth).to.be.true;
                        } catch (error) {
                            await captureScreenshot(driver, `post-button-overflow-${size.label}`);
                            throw error;
                        }
                    });

                    // Test for closing dropdown when clicked outside
                    it(`should close dropdown when clicked outside in ${size.label}`, async function () {
                        try {
                            console.log(`Testing dropdown close on outside click for ${size.label}`);
                            const dropdownButton = await driver.findElement(By.css("#dropdown"));
                            await dropdownButton.click();
                            const bodyElement = await driver.findElement(By.css('body'));
                            await bodyElement.click();

                            const dropdownMenu = await driver.findElement(By.css(".dropdown-menu"));
                            const isDropdownVisible = await dropdownMenu.isDisplayed();
                            expect(isDropdownVisible).to.be.false;
                        } catch (error) {
                            await captureScreenshot(driver, `dropdown-close-outside-${size.label}`);
                            throw error;
                        }
                    });
                });
            });
        });
    });
});
