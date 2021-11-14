module.exports = {
  mode: 'production',
  entry: {
    main: './src/index.ts',
    'flushable-import': './src/flushable-import.ts',
  },
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
