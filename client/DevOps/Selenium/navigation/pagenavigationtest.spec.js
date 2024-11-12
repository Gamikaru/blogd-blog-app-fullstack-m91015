import { Builder } from 'selenium-webdriver';
import {
   login,
   toggleSidebarIfNotVisible,
   navigateToPage,
   clickLogoAndVerifyHome,
   logout,
   initializeTestDriver
} from './navigationHelpers.js';  // Adjust path if necessary

describe('Page Navigation Test with Sidebar Navigation and Logo Click', function () {
   this.timeout(60000); // Increased timeout for the test suite
   const getDriver = initializeTestDriver();

   it('should log in, navigate between pages using sidebar, and return to homepage via logo', async function () {
      const driver = getDriver();
      try {
         // 1. Open login page and log in
         await driver.get('http://localhost:5173/login');
         await login(driver, 'gavrielmrudolph@gmail.com', 'test');

         // 2. Navigate between pages using the sidebar
         await navigateToPage(driver, 'blogs', 'http://localhost:5173/blogs');
         await navigateToPage(driver, 'Admin', 'http://localhost:5173/admin');
         await navigateToPage(driver, 'Network', 'http://localhost:5173/network');

         // 3. Return to homepage via the logo
         await clickLogoAndVerifyHome(driver);

         // 4. Log out
         await logout(driver);

      } catch (error) {
         console.error('Test failed with error:', error);
         throw error;
      }
   });
});
