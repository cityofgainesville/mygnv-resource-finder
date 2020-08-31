// Webpack dev config, uses common config as base

const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.common');
const ErrorOverlayPlugin = require('error-overlay-webpack-plugin');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(process.cwd(), '../.env') });

const dirname = path.resolve(path.dirname(''));

module.exports = merge(common, {
  mode: 'development',
  plugins: [new ErrorOverlayPlugin(), new webpack.HotModuleReplacementPlugin()],
  devtool: 'cheap-module-source-map', // Needed by error-overlay-webpack-plugin
  entry: ['webpack-hot-middleware/client?reload=true&timeout=1000'],
  resolve: {
    alias: {
      'react-dom': '@hot-loader/react-dom',
    },
  },
  devServer: {
    contentBase: path.join(dirname, '../dist/client'),
    historyApiFallback: true,
    compress: true,
    hot: true,
    port: process.env.PORT,
    proxy: {
      '/api': `http://localhost:${String(Number(process.env.PORT) + 1)}`,
    },
  },
});
