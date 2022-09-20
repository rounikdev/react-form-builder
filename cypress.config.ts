import { defineConfig } from 'cypress';

export default defineConfig({
  component: {
    devServer: {
      framework: 'react',
      bundler: 'webpack',
      webpackConfig: require('./.storybook/webpack.test.js')
    },
    excludeSpecPattern: '**/examples/**/*.js',
    setupNodeEvents(on, config) {
      require('@cypress/code-coverage/task')(on, config);

      return config;
    },
    specPattern: 'src/**/*.cy.{ts,tsx}'
  },
  e2e: {
    setupNodeEvents(on, config) {
      require('@cypress/code-coverage/task')(on, config);

      return config;
    },
    excludeSpecPattern: '**/examples/**/*.js'
  },
  experimentalWebKitSupport: true,
  screenshotOnRunFailure: false,
  video: false,
  viewportHeight: 720,
  viewportWidth: 1280
});
