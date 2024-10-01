import assert from 'assert'; // For message verification
import { Builder, By, until } from 'selenium-webdriver';  // Added Builder

// Helper to locate elements with wait (CSS or XPath selectors)
export async function findElementWithWait(driver, selectorOrXPath, isXPath = false, timeout = 10000) {
   if (isXPath) {
      return await driver.wait(until.elementLocated(By.xpath(selectorOrXPath)), timeout);
   } else {
      return await driver.wait(until.elementLocated(By.css(selectorOrXPath)), timeout);
   }
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
         await driver.quit(); // Quit WebDriver after test
      }
   });

   return () => driver;  // Return a function to get the driver instance
}

// Function to toggle the sidebar if not visible
export async function toggleSidebarIfNotVisible(driver) {
   const sidebarToggle = await findElementWithWait(driver, '.sidebar-toggle');
   await driver.wait(until.elementIsVisible(sidebarToggle), 10000);

   try {
      // Check if the sidebar is already open
      await driver.findElement(By.css('.nav-container.open'));
      return;
   } catch (error) {
      await sidebarToggle.click();
   }
   await driver.sleep(1000); // Small delay to ensure the sidebar is fully open
}

// Function to click the logo and verify homepage navigation
export async function clickLogoAndVerifyHome(driver) {
   const logo = await findElementWithWait(driver, '.navbar-logo a');
   await logo.click();

   const homeUrl = await driver.getCurrentUrl();
   assert.strictEqual(homeUrl, 'http://localhost:5173/', 'Successfully navigated back to the homepage.');
}

// Function to log in
export async function login(driver, email, password) {
   const emailField = await findElementWithWait(driver, '.login-input-field');
   await emailField.sendKeys(email);

   const passwordField = await findElementWithWait(driver, '.password-container .login-input-field');
   await passwordField.sendKeys(password);

   const submitBtn = await findElementWithWait(driver, '.submit-btn');
   await submitBtn.click();

   // Ensure login was successful by checking for dropdown visibility
   const dropdown = await findElementWithWait(driver, '.dropdown-toggle');
   assert.ok(dropdown, 'Login successful, dropdown toggle found.');
}

// Function to navigate to a page using the sidebar
export async function navigateToPage(driver, pageName, expectedUrl) {
   await toggleSidebarIfNotVisible(driver);
   const navItem = await findElementWithWait(driver, `//span[text()='${pageName}']`, true);
   await navItem.click();
   const currentUrl = await driver.getCurrentUrl();
   assert.strictEqual(currentUrl, expectedUrl, `Successfully navigated to the ${pageName} page.`);
}

// Function to log out
export async function logout(driver) {
   const dropdownToggle = await findElementWithWait(driver, '.dropdown-toggle');
   await dropdownToggle.click();
   await driver.sleep(1000); // Wait for dropdown animation

   const logoutBtn = await findElementWithWait(driver, '.dropdown-item:nth-child(2)');
   await logoutBtn.click();

   // Confirm logout by checking we're back at the login page
   const loginUrl = await driver.getCurrentUrl();
   assert.strictEqual(loginUrl, 'http://localhost:5173/login', 'Successfully logged out and returned to the login page.');
}
