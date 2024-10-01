import { Builder } from 'selenium-webdriver';
import { findElementWithWait, takeScreenshot } from '../helpers/commonHelpers.js'; // Adjust the path if necessary

describe('Login Page Responsiveness Test', function () {
   this.timeout(60000); // Set timeout for the test suite

   let driver;

   // Initialize WebDriver before tests
   before(async function () {
      driver = await new Builder().forBrowser('chrome').build();
      await driver.get('http://localhost:5173/login'); // Update with the actual URL of the login page
   });

   // Quit WebDriver after all tests
   after(async function () {
      if (driver) {
         await driver.quit();
      }
   });

   // Mobile view test
   it('should be responsive on mobile (375x812)', async function () {
      await driver.manage().window().setRect({ width: 375, height: 812 }); // Mobile resolution
      await driver.sleep(2000); // Allow time for resizing
      await takeScreenshot(driver, 'login-mobile-view'); // Take screenshot for visual confirmation

      // Verify that the logo is displayed
      const logo = await findElementWithWait(driver, '.logo-image', false, 10000);
      if (!logo) throw new Error('Logo not visible in mobile view.');

      // Verify the login card and its components
      const loginCard = await findElementWithWait(driver, '.login-card', false, 10000);
      if (!loginCard) throw new Error('Login card not visible in mobile view.');

      const emailField = await findElementWithWait(driver, '.login-input-field', false, 10000);
      if (!emailField) throw new Error('Email input field not visible in mobile view.');

      const passwordField = await findElementWithWait(driver, '.password-container .login-input-field', false, 10000);
      if (!passwordField) throw new Error('Password input field not visible in mobile view.');

      const submitBtn = await findElementWithWait(driver, '.submit-btn', false, 10000);
      if (!submitBtn) throw new Error('Submit button not visible in mobile view.');

      console.log('Mobile view passed.');
   });

   // Tablet view test
   it('should be responsive on tablet (768x1024)', async function () {
      await driver.manage().window().setRect({ width: 768, height: 1024 }); // Tablet resolution
      await driver.sleep(2000); // Allow time for resizing
      await takeScreenshot(driver, 'login-tablet-view'); // Take screenshot for visual confirmation

      // Verify that the logo is displayed
      const logo = await findElementWithWait(driver, '.logo-image', false, 10000);
      if (!logo) throw new Error('Logo not visible in tablet view.');

      // Verify the login card and its components
      const loginCard = await findElementWithWait(driver, '.login-card', false, 10000);
      if (!loginCard) throw new Error('Login card not visible in tablet view.');

      const emailField = await findElementWithWait(driver, '.login-input-field', false, 10000);
      if (!emailField) throw new Error('Email input field not visible in tablet view.');

      const passwordField = await findElementWithWait(driver, '.password-container .login-input-field', false, 10000);
      if (!passwordField) throw new Error('Password input field not visible in tablet view.');

      const submitBtn = await findElementWithWait(driver, '.submit-btn', false, 10000);
      if (!submitBtn) throw new Error('Submit button not visible in tablet view.');

      console.log('Tablet view passed.');
   });

   // Desktop view test
   it('should be responsive on desktop (1920x1080)', async function () {
      await driver.manage().window().setRect({ width: 1920, height: 1080 }); // Desktop resolution
      await driver.sleep(2000); // Allow time for resizing
      await takeScreenshot(driver, 'login-desktop-view'); // Take screenshot for visual confirmation

      // Verify that the logo is displayed
      const logo = await findElementWithWait(driver, '.logo-image', false, 10000);
      if (!logo) throw new Error('Logo not visible in desktop view.');

      // Verify the login card and its components
      const loginCard = await findElementWithWait(driver, '.login-card', false, 10000);
      if (!loginCard) throw new Error('Login card not visible in desktop view.');

      const emailField = await findElementWithWait(driver, '.login-input-field', false, 10000);
      if (!emailField) throw new Error('Email input field not visible in desktop view.');

      const passwordField = await findElementWithWait(driver, '.password-container .login-input-field', false, 10000);
      if (!passwordField) throw new Error('Password input field not visible in desktop view.');

      const submitBtn = await findElementWithWait(driver, '.submit-btn', false, 10000);
      if (!submitBtn) throw new Error('Submit button not visible in desktop view.');

      console.log('Desktop view passed.');
   });
});
