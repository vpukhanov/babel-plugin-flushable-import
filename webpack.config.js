const nodeExternals = require('webpack-node-externals')

module.exports = {
  mode: 'production',
  entry: {
    index: './src/index.ts',
    'flushable-import': './src/flushable-import.ts',
  },
  output: {
    library: {
      type: 'commonjs',
    },
  },
  externals: [nodeExternals()],
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
    ],
  },
  resolve: {
    extensions: ['.ts'],
  },
}
