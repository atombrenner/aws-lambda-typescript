const path = require('path')

module.exports = {
  mode: 'production',
  devtool: false,
  target: 'node',
  entry: './src/lambda.ts',
  output: {
    path: path.resolve('./dist'),
    filename: 'lambda.js',
    libraryTarget: 'commonjs',
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        include: path.resolve('./src'),
        use: [
          {
            loader: 'babel-loader',
          },
        ],
      },
    ],
  },
  performance: { maxAssetSize: 200 * 1024, hints: 'error' },
}
