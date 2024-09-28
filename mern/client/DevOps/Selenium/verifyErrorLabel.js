import { By } from "selenium-webdriver";

// Function to verify an inline error message for a field
// Function to verify an inline error message for a field

export async function verifyErrorLabel(driver, fieldCssSelector, expectedErrorMessage) {
   try {
      // Locate the parent container (input-field-wrapper) that holds both the field and the error label
      const fieldWrapper = await driver.findElement(By.css(`${fieldCssSelector}`)).findElement(By.xpath('ancestor::div[contains(@class, "input-field-wrapper")]'));

      // Find the error label within this parent container
      const errorLabel = await fieldWrapper.findElement(By.css('span.error-label'));
      const actualErrorMessage = await errorLabel.getText();
      console.log(`Error label found: ${actualErrorMessage}`);

      // Assert that the error message is what we expect
      if (actualErrorMessage !== expectedErrorMessage) {
         throw new Error(`Expected error message: '${expectedErrorMessage}', but got: '${actualErrorMessage}'`);
      }

      console.log(`Inline error message for ${fieldCssSelector} verified: ${expectedErrorMessage}`);
   } catch (error) {
      throw new Error(`Error label for ${fieldCssSelector} not found or incorrect: ${error.message}`);
   }
}
