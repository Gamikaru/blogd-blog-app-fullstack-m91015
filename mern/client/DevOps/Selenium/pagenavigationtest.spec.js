import { Builder, By, until } from 'selenium-webdriver';
import assert from 'assert';

describe('Page Navigation Test with Sidebar Navigation and Logo Click', function () {
   this.timeout(60000); // Increased timeout for the test suite
   let driver;

   // Set up the browser before each test
   beforeEach(async function () {
      driver = await new Builder().forBrowser('chrome').build();
      await driver.manage().window().setRect({ width: 1552, height: 832 }); // Set window size
      console.log('Browser setup completed');
   });

   // Clean up the browser after each test
   afterEach(async function () {
      await driver.quit();
      console.log('Browser closed');
   });

   const toggleSidebarIfNotVisible = async () => {
      const sidebarToggle = await driver.wait(until.elementLocated(By.css('.sidebar-toggle')), 10000);
      await driver.wait(until.elementIsVisible(sidebarToggle), 10000);
      console.log('Sidebar toggle is visible');

      try {
         const visibleNavItem = await driver.findElement(By.css('.nav-container.open'));
         console.log('Sidebar is already open');
         return;
      } catch (error) {
         console.log('Sidebar is closed, clicking toggle to open');
         await sidebarToggle.click();
      }

      await driver.sleep(1000); // Small delay to ensure the sidebar is fully open
   };

   const clickLogoAndVerifyHome = async () => {
      console.log('Clicking on logo to navigate back to homepage');
      const logo = await driver.wait(until.elementLocated(By.css('.navbar-logo a')), 10000);
      await logo.click();

      const homeUrl = await driver.getCurrentUrl();
      console.log('Navigated back to homepage: ', homeUrl);
      assert.strictEqual(homeUrl, 'http://localhost:5173/', 'Successfully navigated back to the homepage.');
   };

   it('should log in, navigate between pages using sidebar, and return to homepage via logo', async function () {
      try {
         // 1. Open the login page
         console.log('Opening login page');
         await driver.get('http://localhost:5173/login');

         // 2. Log in with valid credentials
         console.log('Entering login credentials');
         const emailField = await driver.wait(until.elementLocated(By.css('.login-input-field')), 10000);
         await emailField.sendKeys('gavrielmrudolph@gmail.com');
         const passwordField = await driver.findElement(By.css('.password-container .login-input-field'));
         await passwordField.sendKeys('test');
         const submitBtn = await driver.findElement(By.css('.submit-btn'));
         console.log('Clicking submit button for login');
         await submitBtn.click();

         // 3. Ensure login was successful (check for dropdown)
         console.log('Waiting for dropdown after login');
         const dropdown = await driver.wait(until.elementLocated(By.css('.dropdown-toggle')), 10000);
         assert.ok(dropdown, 'Login successful, dropdown toggle found.');
         console.log('Login successful');

         // 4. Navigate between pages using the sidebar
         console.log('Ensuring sidebar is open and navigating between pages using sidebar');

         // Navigate from Home to Bloggs
         await toggleSidebarIfNotVisible();
         const bloggsNavItem = await driver.wait(until.elementLocated(By.xpath("//span[text()='Bloggs']")), 10000);
         await bloggsNavItem.click();
         let currentUrl = await driver.getCurrentUrl();
         console.log('Navigated to Bloggs page: ', currentUrl);
         assert.strictEqual(currentUrl, 'http://localhost:5173/bloggs', 'Successfully navigated to the Bloggs page.');

         // Navigate from Bloggs to Admin (using sidebar, no logo click)
         await toggleSidebarIfNotVisible();
         const adminNavItem = await driver.wait(until.elementLocated(By.xpath("//span[text()='Admin']")), 10000);
         await adminNavItem.click();
         currentUrl = await driver.getCurrentUrl();
         console.log('Navigated to Admin page: ', currentUrl);
         assert.strictEqual(currentUrl, 'http://localhost:5173/admin', 'Successfully navigated to the Admin page.');

         // Navigate from Admin to Network (using sidebar, no logo click)
         await toggleSidebarIfNotVisible();
         const networkNavItem = await driver.wait(until.elementLocated(By.xpath("//span[text()='Network']")), 10000);
         await networkNavItem.click();
         currentUrl = await driver.getCurrentUrl();
         console.log('Navigated to Network page: ', currentUrl);
         assert.strictEqual(currentUrl, 'http://localhost:5173/network', 'Successfully navigated to the Network page.');

         // 5. Click logo to return to homepage from Network page
         await clickLogoAndVerifyHome();

         // 6. Logout
         console.log('Attempting to log out');
         const dropdownToggle = await driver.findElement(By.css('.dropdown-toggle'));
         await driver.wait(until.elementIsVisible(dropdownToggle), 10000);
         await dropdownToggle.click();
         await driver.sleep(1000);

         const logoutBtn = await driver.wait(until.elementLocated(By.css('.dropdown-item:nth-child(2)')), 10000);
         await driver.wait(until.elementIsVisible(logoutBtn), 10000); // Add an additional check for visibility
         console.log('Clicking logout button');
         await logoutBtn.click();

         // Confirm that we're back at the login page
         const loginUrl = await driver.getCurrentUrl();
         console.log('Navigated to login page after logout: ', loginUrl);
         assert.strictEqual(loginUrl, 'http://localhost:5173/login', 'Successfully logged out and navigated back to the login page.');
      } catch (error) {
         console.error('Test failed with error:', error);
         throw error;
      }
   });
});
