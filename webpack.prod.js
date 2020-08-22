// Webpack production config, uses common config as base

import merge from 'webpack-merge';
import common from './webpack.common.js';

export default merge(common, {
  mode: 'production',
});
