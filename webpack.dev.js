// Webpack dev config, uses common config as base

const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.common');
const ErrorOverlayPlugin = require('error-overlay-webpack-plugin');

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
});
