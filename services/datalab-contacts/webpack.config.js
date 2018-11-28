//
// Copyright 2017 Wireline, Inc.
//

const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ZipPlugin = require('zip-webpack-plugin');
const dictionaryEN = path.dirname(require.resolve('dictionary-en-gb'));

module.exports = {
  target: 'node',

  stats: 'errors-only',

  entry: {
    handler: [path.resolve('./handler.js')]
  },

  node: {
    __dirname: false
  },

  output: {
    path: path.resolve('./dist'),
    filename: '[name].js',
    libraryTarget: 'commonjs2'
  },

  // https://webpack.js.org/configuration/devtool/
  devtool: 'source-map',

  plugins: [
    new CopyWebpackPlugin(['wireline.yml', 'service.yml']),
    new ZipPlugin({
      path: '../',
      filename: 'webpack.zip'
    }),
    new webpack.IgnorePlugin(/^electron$/),
    // The pg-native bindings are not needed.
    new webpack.IgnorePlugin(/\.\/native/, /\/pg\//),
    // The Swagger autogenerated API clients misbehave without this due to a problem with superagent.
    new webpack.DefinePlugin({ 'global.GENTLY': false })
  ],

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/, // Don't transpile deps.
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: './dist/babel-cache/'
          }
        }
      },
      {
        test: /\.mjs$/,
        include: /node_modules/,
        type: 'javascript/auto'
      }
    ]
  }
};