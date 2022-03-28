const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');

// Resolves:
const aliases = {
  '@components': path.resolve(__dirname, '..', 'src', 'components'),
  '@managers': path.resolve(__dirname, '..', 'src', 'managers'),
  '@pages': path.resolve(__dirname, '..', 'src', 'pages'),
  '@providers': path.resolve(__dirname, '..', 'src', 'providers'),
  '@root': path.resolve(__dirname, '..', 'src'),
  '@services': path.resolve(__dirname, '..', 'src', 'services'),
  '@ui': path.resolve(__dirname, '..', 'src', 'ui')
};

const extensions = ['.ts', '.tsx'];

// Rules:
const fontsRule = {
  test: /\.(woff|woff2|ttf|eot)$/,
  type: 'asset/resource',
  generator: {
    filename: 'public/fonts/[name][ext]'
  }
};

const imagesRule = {
  test: /\.(png|jpe?g|gif|svg|ico)$/,
  type: 'asset/resource',
  generator: {
    filename: 'public/images/[name][ext]'
  }
};

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

const tsRule = {
  test: /\.(js|jsx|ts|tsx)$/,
  exclude: /node_modules/,
  use: {
    loader: 'babel-loader',
    options: {
      plugins: ['@babel/plugin-transform-runtime', 'istanbul'],
      presets: [
        '@babel/preset-typescript',
        '@babel/preset-env',
        ['@babel/preset-react', { runtime: 'automatic' }]
      ]
    }
  }
};

// Plugins:
const miniCssExtractPlugin = new MiniCssExtractPlugin({
  filename: '[name].css',
  chunkFilename: '[name].css'
});

module.exports = {
  aliases,
  extensions,
  fontsRule,
  imagesRule,
  miniCssExtractPlugin,
  scssRule,
  tsRule
};
