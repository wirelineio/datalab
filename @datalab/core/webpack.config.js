const path = require('path');

module.exports = {
  mode: 'development',
  devtool: '#source-map',
  stats: 'errors-only',
  entry: './src/index.js',
  output: {
    filename: 'datalab-core.js',
    path: path.resolve(__dirname, 'dist'),
    library: 'datalabCore',
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
