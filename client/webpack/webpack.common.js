// Setup webpack common config

const path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const isDevelopment = process.env.NODE_ENV === 'development';

const dirname = path.resolve(path.dirname(''));

module.exports = {
  entry: ['@babel/polyfill', 'react-hot-loader/patch', './index.js'],
  output: {
    path: path.join(dirname, './dist/'),
    publicPath: '/',
    filename: '[hash]-[name].js',
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: './index.html',
      filename: './index.html',
    }),
    new MiniCssExtractPlugin({
      filename: isDevelopment ? '[name].css' : '[name].[hash].css',
      chunkFilename: isDevelopment ? '[id].css' : '[id].[hash].css',
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,

        loaders: ['babel-loader'],
      },
      {
        test: /\.s?css$/,
        oneOf: [
          {
            test: /\.module\.s?css$/,
            use: [
              {
                loader: MiniCssExtractPlugin.loader,
                options: { hmr: isDevelopment },
              },
              {
                loader: 'css-loader',
                options: {
                  modules: true,
                  exportOnlyLocals: false,
                  sourceMap: isDevelopment,
                },
              },
              {
                loader: 'sass-loader',
                options: {
                  sourceMap: isDevelopment,
                },
              },
            ],
          },
          {
            use: [
              {
                loader: MiniCssExtractPlugin.loader,
                options: { hmr: isDevelopment },
              },
              {
                loader: 'css-loader',
                options: {
                  sourceMap: isDevelopment,
                },
              },
              {
                loader: 'sass-loader',
                options: {
                  sourceMap: isDevelopment,
                },
              },
            ],
          },
        ],
      },
      {
        test: /\.(woff|woff2|eot|ttf|png|jp(e*)g|svg)(\?.*$|$)/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[hash]-[name].[ext]',
            },
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx', '.scss'],
  },
};
