const webpack = require('webpack')

module.exports = {
  mode: 'production',
  devtool: false,
  target: 'node',
  entry: './src/index.ts',
  output: {
    filename: 'index.js',
    libraryTarget: 'commonjs2',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },
  externals: ['zlib', 'aws-sdk'],
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: [
          {
            loader: require.resolve('ts-loader'),
          },
        ],
      },
    ],
  },
  performance: {
    hints: false,
  },
}
