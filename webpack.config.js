const path = require('path');
const webpack = require('webpack');

module.exports = {
  mode: 'development',
  entry: {
    app: './src/main.ts'
  },
  target: 'node',
  output: {
    path: path.join(process.cwd(), 'dist'),
    filename: 'bundle.js',
    libraryTarget: 'commonjs2',
  },
  resolve: {
    extensions: [
      '.js',
      '.jsx',
      '.json',
      '.ts',
      '.tsx'
    ],
  },
  module: {
    rules: [
      {
        test: /\.ts(x?)$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
      }
    ]
  },
  plugins: [
    // new webpack.IgnorePlugin(/^pg-native$/),
    // new webpack.IgnorePlugin(/^tedious$/),
    // new webpack.IgnorePlugin(/^sqlite3$/),
    // new webpack.IgnorePlugin(/^mysql2$/)
  ],
  // output: {
  //   path: path.join(process.cwd(), 'dist/build'),
  //   filename: 'bundle.js',
  //   libraryTarget: 'commonjs2',
  // },
  // externals: [
  //   nodeExternals()
  // ],
  // externals: [ 'sqlite3', 'tedious', 'pg-hstore']
  devtool: 'inline-source-map',
};
