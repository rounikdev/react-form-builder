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
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      return require('./cypress/plugins/index.js')(on, config);
    },
    specPattern: 'src/**/*.cy.{ts,tsx}'
  },
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      return require('./cypress/plugins/index.js')(on, config);
    },
    excludeSpecPattern: '**/examples/**/*.js'
  },
  screenshotOnRunFailure: false,
  video: false,
  viewportHeight: 720,
  viewportWidth: 1280
});
