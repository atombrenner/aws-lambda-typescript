const path = require('path')

module.exports = {
  mode: 'production',
  devtool: false,
  target: 'node',
  entry: './src/lambda.ts',
  output: {
    path: path.resolve('./dist'),
    filename: 'lambda.js',
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        //include: path.resolve('./src'),
        use: [
          {
            loader: 'babel-loader',
          },
        ],
      },
    ],
  },
  performance: { hints: false },
}
