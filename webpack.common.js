// Setup webpack common config

import path from 'path';
import HtmlWebPackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

const isDevelopment = process.env.NODE_ENV === 'development';

const __dirname = path.resolve(path.dirname(''));

export default {
  entry: ['@babel/polyfill', 'react-hot-loader/patch', './client/index.js'],
  output: {
    path: path.join(__dirname, 'dist'),
    publicPath: '/',
    filename: '[hash]-[name].js',
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: './client/index.html',
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
        test: /\.(png|jp(e*)g|svg)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 20000, // Convert images < 20kb to base64 strings
              name: '[hash]-[name].[ext]',
            },
          },
        ],
      },
      {
        test: /\.(woff|woff2|eot|ttf)(\?.*$|$)/,
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
