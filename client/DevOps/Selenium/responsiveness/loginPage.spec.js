// loginResponsiveness.spec.js

import { Builder, By, until } from 'selenium-webdriver';
import { findElementWithWait, takeScreenshot } from '../helpers/commonHelpers.js';
import assert from 'assert';
import edge from 'selenium-webdriver/edge.js';

const BROWSERS = ['chrome', 'edge']; // Define supported browsers

// Function to initialize WebDriver for different browsers
function getDriver(browserName) {
   if (browserName === 'chrome') {
      return new Builder().forBrowser('chrome').build();
   } else if (browserName === 'edge') {
      // Set up Edge WebDriver service
      const options = new edge.Options();
      const service = new edge.ServiceBuilder('/usr/local/bin/msedgedriver');
      return new Builder()
         .forBrowser('MicrosoftEdge')
         .setEdgeOptions(options)
         .setEdgeService(service)
         .build();
   } else {
      throw new Error('Unsupported browser: ' + browserName);
   }
}

BROWSERS.forEach((browserName) => {
   describe(`Login Page Responsiveness Test on ${browserName}`, function () {
      this.timeout(60000); // Set timeout for the test suite

      let driver;

      // Initialize WebDriver before tests
      before(async function () {
         driver = getDriver(browserName); // Initialize driver for the given browser
         await driver.get('http://localhost:5173/login'); // Update with the actual URL of the login page
      });

      // Quit WebDriver after all tests
      after(async function () {
         if (driver) {
            await driver.quit();
         }
      });

      // Helper function to verify login page components
      async function verifyLoginPageComponents(view) {
         // Verify that the logo is displayed
         const logo = await findElementWithWait(driver, '.logo-image');
         assert.ok(logo, `Logo not visible in ${view} view.`);

         // Verify the login card and its components
         const loginCard = await findElementWithWait(driver, '.login-card');
         assert.ok(loginCard, `Login card not visible in ${view} view.`);

         const emailField = await findElementWithWait(driver, '.login-input-field');
         assert.ok(emailField, `Email input field not visible in ${view} view.`);

         const passwordField = await findElementWithWait(driver, '.password-container .login-input-field');
         assert.ok(passwordField, `Password input field not visible in ${view} view.`);

         const submitBtn = await findElementWithWait(driver, '.submit-btn');
         assert.ok(submitBtn, `Submit button not visible in ${view} view.`);

         console.log(`${view} view passed in ${browserName}.`);
      }

      // Mobile view test
      it(`should be responsive on mobile (375x812) in ${browserName}`, async function () {
         await driver.manage().window().setRect({ width: 375, height: 812 }); // Mobile resolution
         await driver.sleep(2000); // Allow time for resizing
         await takeScreenshot(driver, `login-mobile-view-${browserName}`); // Take screenshot for visual confirmation

         await verifyLoginPageComponents('mobile');
      });

      // Tablet view test
      it(`should be responsive on tablet (768x1024) in ${browserName}`, async function () {
         await driver.manage().window().setRect({ width: 768, height: 1024 }); // Tablet resolution
         await driver.sleep(2000); // Allow time for resizing
         await takeScreenshot(driver, `login-tablet-view-${browserName}`); // Take screenshot for visual confirmation

         await verifyLoginPageComponents('tablet');
      });

      // Desktop view test
      it(`should be responsive on desktop (1920x1080) in ${browserName}`, async function () {
         await driver.manage().window().setRect({ width: 1920, height: 1080 }); // Desktop resolution
         await driver.sleep(2000); // Allow time for resizing
         await takeScreenshot(driver, `login-desktop-view-${browserName}`); // Take screenshot for visual confirmation

         await verifyLoginPageComponents('desktop');
      });
   });
});
