import { Builder, until, By } from 'selenium-webdriver';
import { login, takeScreenshot } from '../helpers/commonHelpers.js'; // Using login helper and screenshot helper
import assert from 'assert';
import edge from 'selenium-webdriver/edge.js'; // Correct path for Edge WebDriver

const BROWSERS = ['chrome', 'edge']; // Define supported browsers

// Function to initialize WebDriver for different browsers
function getDriver(browserName) {
   if (browserName === 'chrome') {
      return new Builder().forBrowser('chrome').build();
   } else if (browserName === 'edge') {
      // Set up Edge WebDriver service
      const options = new edge.Options();
      const service = new edge.ServiceBuilder('/usr/local/bin/msedgedriver');
      return new Builder().forBrowser('MicrosoftEdge').setEdgeOptions(options).setEdgeService(service).build();
   } else {
      throw new Error('Unsupported browser: ' + browserName);
   }
}

BROWSERS.forEach((browserName) => {
   describe(`Home Page Responsiveness Test on ${browserName}`, function () {
      this.timeout(120000); // Increased timeout for the test suite

      let driver;

      // Initialize WebDriver before tests
      before(async function () {
         try {
            driver = getDriver(browserName); // Initialize driver for the given browser
            await driver.get('http://localhost:5173/login'); // Start at login page

            // Perform login using the helper
            await login(driver, 'test@test.com', 'test'); // Replace with valid credentials

            // Ensure the URL contains '/' after successful login
            await driver.wait(until.urlIs('http://localhost:5173/'), 15000); // Wait for home page navigation

            // Optionally take a screenshot after login
            await takeScreenshot(driver, `homepage-login-success-${browserName}`);
         } catch (error) {
            console.error(`Error during setup for ${browserName}:`, error);
            throw error; // Ensure test suite fails if the setup fails
         }
      });

      // Quit WebDriver after all tests
      after(async function () {
         if (driver) {
            await driver.quit();
         }
      });

      // Helper to check if the main components are displayed
      async function verifyComponents() {
         try {
            const userCard = await driver.findElement(By.css('.user-card-container'));
            const postCard = await driver.findElement(By.css('.home-post-card-container'));

            // Assert both components are visible
            assert.ok(userCard, 'UserCard is not visible.');
            assert.ok(postCard, 'PostCard is not visible.');
         } catch (error) {
            console.error(`Error verifying components in ${browserName}:`, error);
            throw error;
         }
      }

      // Mobile view test
      it(`should be responsive on mobile (375x812) in ${browserName}`, async function () {
         try {
            await driver.manage().window().setRect({ width: 375, height: 812 }); // Mobile resolution
            await driver.sleep(2000); // Allow time for resizing

            await verifyComponents(); // Check if main components are visible
            await takeScreenshot(driver, `homepage-mobile-view-${browserName}`); // Take screenshot for visual confirmation

            console.log(`Mobile view passed in ${browserName}.`);
         } catch (error) {
            console.error(`Mobile view failed on ${browserName}:`, error);
            throw error; // Fail the test if this step fails
         }
      });

      // Tablet view test
      it(`should be responsive on tablet (768x1024) in ${browserName}`, async function () {
         try {
            await driver.manage().window().setRect({ width: 768, height: 1024 }); // Tablet resolution
            await driver.sleep(2000); // Allow time for resizing

            await verifyComponents(); // Check if main components are visible
            await takeScreenshot(driver, `homepage-tablet-view-${browserName}`); // Take screenshot for visual confirmation

            console.log(`Tablet view passed in ${browserName}.`);
         } catch (error) {
            console.error(`Tablet view failed on ${browserName}:`, error);
            throw error;
         }
      });

      // Desktop view test
      it(`should be responsive on desktop (1920x1080) in ${browserName}`, async function () {
         try {
            await driver.manage().window().setRect({ width: 1920, height: 1080 }); // Desktop resolution
            await driver.sleep(2000); // Allow time for resizing

            await verifyComponents(); // Check if main components are visible
            await takeScreenshot(driver, `homepage-desktop-view-${browserName}`); // Take screenshot for visual confirmation

            console.log(`Desktop view passed in ${browserName}.`);
         } catch (error) {
            console.error(`Desktop view failed on ${browserName}:`, error);
            throw error;
         }
      });
   });
});
