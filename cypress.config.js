const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    // Frontend URL'i - Vite default port 5173, ama 3001'e ayarladık
    baseUrl: 'http://localhost:3001',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'cypress/support/e2e.js',
    // Video kaydı ayarları
    video: true,
    videoCompression: 32,
    videosFolder: 'cypress/videos',
    screenshotOnRunFailure: true,
    screenshotsFolder: 'cypress/screenshots',
  },
  env: {
    apiUrl: 'http://localhost:3000/api/v1',
    frontendUrl: 'http://localhost:3001'
  }
})

