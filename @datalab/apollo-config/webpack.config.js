const path = require('path');

module.exports = {
  mode: 'development',
  stats: 'errors-only',
  entry: './src/apollo-config.js',
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist'),
    library: 'apolloConfig',
    libraryTarget: 'umd'
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: 'babel-loader'
      }
    ]
  }
};
