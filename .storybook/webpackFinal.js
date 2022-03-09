const { aliases, extensions, miniCssExtractPlugin, scssRule } = require('./webpack-helpers');

module.exports = (config) => {
  return {
    ...config,
    module: {
      ...config.module,
      rules: [...config.module.rules, scssRule]
    },
    plugins: [...config.plugins, miniCssExtractPlugin],
    resolve: {
      ...config.resolve,
      alias: {
        ...config.resolve.alias,
        ...aliases
      },
      extensions: [...config.resolve.extensions, ...extensions]
    }
  };
};
