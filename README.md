# CGMTask
WebdriverIO TypeScript Mocha Framework & Allure Reporter
This repository contains examples of using WebdriverIO, TypeScript, Mocha Framework, and Allure Reporter to test a German-language application using the Chrome Browser. The code in this repository is managed using Git version control with GitHub.


Getting Started
1. Clone the repository:

git clone https://github.com/sadabnepal/webdriverio-ts-mocha.git
cd webdriverio-ts-mocha


2. Install dependencies:

npm install --legacy-peer-deps

3. Run tests:
npm test                [ UI test in chrome ]
npm run cross-browser   [ UI test in chrome and edge ]

4. Generate report:
npm run report

5. Cleanup report folder:
npm run cleanup

Configuration
Key features of the configuration include:

* Page Object Design pattern
* Custom types for web elements
* Parallel execution and Cross browser testing
* Report integration with screenshot on failure

The project structure includes the following:

* config: Configuration files for WebdriverIO
* pages: Page Object Model (POM) files
* specs: Test specifications
* static: Static assets
* types: Custom TypeScript types


Additional Hints
Use Git version control with GitHub
Test using WebdriverIO, TypeScript, Mocha Framework, and Allure Reporter
Test in the Chrome Browser
Be aware of the German-language application and use English for specifications and code
Be cautious when using live translation tools, as they may affect the DOM
