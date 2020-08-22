// Webpack dev config, uses common config as base

import webpack from 'webpack';
import merge from 'webpack-merge';
import common from './webpack.common';
import ErrorOverlayPlugin from 'error-overlay-webpack-plugin';

export default merge(common, {
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
