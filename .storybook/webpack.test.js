/* eslint-disable @typescript-eslint/no-var-requires */
const webpack = require('webpack');

const {
  aliases,
  extensions,
  fontsRule,
  imagesRule,
  miniCssExtractPlugin,
  scssRule,
  tsRule
} = require('./webpack-helpers');

module.exports = {
  resolve: {
    alias: aliases,
    extensions: [...extensions, '.js', '.jsx']
  },
  module: {
    rules: [tsRule, fontsRule, imagesRule, scssRule]
  },
  plugins: [
    miniCssExtractPlugin,
    new webpack.DefinePlugin({
      __mode__: 'development'
    })
  ]
};
