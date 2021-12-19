const webpackFinal = require('./webpackFinal');

module.exports = {
  addons: ['@storybook/addon-a11y', '@storybook/addon-links', '@storybook/addon-essentials'],
  core: {
    builder: 'webpack5'
  },
  stories: ['../src/**/*.stories.tsx'],
  webpackFinal
};
