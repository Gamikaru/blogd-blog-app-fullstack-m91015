// registerModalResponsiveness.spec.js

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
   describe(`Register Modal Responsiveness Test on ${browserName}`, function () {
      this.timeout(120000); // Increase timeout for the test suite

      let driver;

      // Initialize WebDriver before tests
      before(async function () {
         driver = getDriver(browserName);
         await driver.get('http://localhost:5173/login'); // Update with the actual URL of the login page
      });

      // Quit WebDriver after all tests
      after(async function () {
         if (driver) {
            await driver.quit();
         }
      });

      // Helper to open the register modal
      async function openRegisterModal() {
         // Locate the register link
         const registerLink = await driver.wait(until.elementLocated(By.css('.register-link')), 15000); // Increase timeout

         // Scroll the register link into view
         await driver.executeScript('arguments[0].scrollIntoView(true);', registerLink);
         await driver.sleep(1000); // Allow time for the scroll and render

         // Use JavaScript to click the element to bypass potential layout issues
         try {
            await driver.executeScript('arguments[0].click();', registerLink); // Trigger the modal opening
            console.log('Register link clicked using JS.');
         } catch (error) {
            console.log('Error in JS click:', error);
            throw error;
         }

         await driver.sleep(5000); // Increased wait time for modal to open due to transitions

         // Polling the DOM to ensure the modal is visible and has the `.open` class
         const modalAppeared = await driver.executeAsyncScript(function (done) {
            const checkModal = () => {
               const modal = document.querySelector('.register-modal-container');
               if (modal && modal.classList.contains('open')) {
                  done(true);
               } else {
                  setTimeout(checkModal, 1000); // Poll every 1 second
               }
            };
            checkModal();
         });

         assert.ok(modalAppeared, 'Register modal did not open.');
      }

      // Helper to verify register modal components
      async function verifyRegisterModalComponents(view) {
         // Assert that the register modal title is displayed
         const registerTitle = await findElementWithWait(driver, '.register-modal-title', false, 15000); // Increased timeout
         assert.ok(registerTitle, `Register title not visible in ${view} view.`);

         // Verify other components as needed
         console.log(`${view} view passed in ${browserName}.`);
      }

      // Mobile view test
      it(`should be responsive on mobile (375x812) in ${browserName}`, async function () {
         await driver.manage().window().setRect({ width: 375, height: 812 }); // Mobile resolution
         await driver.sleep(2000); // Allow time for resizing

         await openRegisterModal();
         await takeScreenshot(driver, `register-modal-mobile-view-${browserName}`); // Take screenshot for visual confirmation

         await verifyRegisterModalComponents('mobile');
      });

      // Tablet view test
      it(`should be responsive on tablet (768x1024) in ${browserName}`, async function () {
         await driver.manage().window().setRect({ width: 768, height: 1024 }); // Tablet resolution
         await driver.sleep(2000); // Allow time for resizing

         await openRegisterModal();
         await takeScreenshot(driver, `register-modal-tablet-view-${browserName}`); // Take screenshot for visual confirmation

         await verifyRegisterModalComponents('tablet');
      });

      // Desktop view test
      it(`should be responsive on desktop (1920x1080) in ${browserName}`, async function () {
         await driver.manage().window().setRect({ width: 1920, height: 1080 }); // Desktop resolution
         await driver.sleep(2000); // Allow time for resizing

         await openRegisterModal();
         await takeScreenshot(driver, `register-modal-desktop-view-${browserName}`); // Take screenshot for visual confirmation

         await verifyRegisterModalComponents('desktop');
      });
   });
});
