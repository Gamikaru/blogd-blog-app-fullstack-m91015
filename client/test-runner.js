import { execSync } from 'child_process';
import path from 'path';

// Get the filename from the command-line arguments or default to all .spec.js files
const testFile = process.argv[2]
   ? path.join('./DevOps/Selenium', process.argv[2])  // Use the specified test file in DevOps/Selenium
   : './DevOps/Selenium/**/*.spec.js';                // Default to running all tests

// Run the Mocha command with the specified file or default to all tests
execSync(`mocha "${testFile}"`, { stdio: 'inherit' });
