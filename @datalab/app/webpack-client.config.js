//
// Copyright 2018 Wireline, Inc.
//

const path = require('path');

const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  target: 'web',

  mode: 'development',

  stats: 'errors-only',

  // Source map shows the original source and line numbers (and works with hot loader).
  // https://webpack.github.io/docs/configuration.html#devtool
  devtool: '#source-map',

  // https://webpack.js.org/configuration/resolve
  resolve: {
    extensions: ['.js'],

    // Resolve imports/requires.
    modules: ['node_modules']
  },

  entry: {
    app: [path.resolve('./src/index.js')]
  },

  output: {
    path: path.resolve('./dist/assets/'),
    filename: '[name].js',
    publicPath: '/assets/'
  },

  devServer: {
    compress: true,
    publicPath: '/assets/',
    port: 8080
  },

  // https://www.npmjs.com/package/html-webpack-plugin
  plugins: [
    new CopyWebpackPlugin(['assets']),

    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
    })
    // process.env.NODE_ENV && new webpack.optimize.UglifyJsPlugin({ compress: true })
  ].filter(Boolean),

  module: {
    rules: [
      // js/mjs
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader'
        }
      },

      {
        test: /\.mjs$/,
        include: /node_modules/,
        type: 'javascript/auto'
      },

      // css
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },

      // fonts
      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'fonts/'
            }
          }
        ]
      }
    ]
  }
};
