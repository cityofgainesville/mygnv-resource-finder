// Webpack production config, uses common config as base

const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'production',
  optimization: {
    splitChunks: {
      minSize: 10000,
      maxSize: 250000,
    },
  },
});
