const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');

const aliases = {
  '@components': path.resolve(__dirname, '..', 'src', 'components'),
  '@managers': path.resolve(__dirname, '..', 'src', 'managers'),
  '@pages': path.resolve(__dirname, '..', 'src', 'pages'),
  '@providers': path.resolve(__dirname, '..', 'src', 'providers'),
  '@root': path.resolve(__dirname, '..'),
  '@services': path.resolve(__dirname, '..', 'src', 'services')
};

const extensions = ['.ts', '.tsx'];

const scssRule = {
  test: /\.scss$/,
  use: [
    {
      loader: MiniCssExtractPlugin.loader
    },
    {
      loader: 'css-loader',
      options: {
        importLoaders: 3,
        modules: {
          localIdentName: '[name]__[local]__container__[hash:base64:5]'
        },
        sourceMap: true
      }
    },
    {
      loader: 'postcss-loader',
      options: {
        postcssOptions: {
          plugins: ['autoprefixer']
        }
      }
    },
    { loader: 'sass-loader' }
  ]
};

module.exports = (config) => {
  return {
    ...config,
    module: {
      ...config.module,
      rules: [...config.module.rules, scssRule]
    },
    plugins: [
      ...config.plugins,
      new MiniCssExtractPlugin({
        filename: '[name].css',
        chunkFilename: '[name].css'
      })
    ],
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
