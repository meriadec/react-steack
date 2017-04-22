const path = require('path')
const webpack = require('webpack')

const examplesFolder = path.resolve(__dirname, 'examples')
const distFolder = path.resolve(__dirname, 'dist')

const config = {
  entry: './examples/app.js',
  output: {
    path: distFolder,
    publicPath: '/',
    filename: 'bundle.js',
  },
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loaders: ['babel-loader'],
    }],
  },
  plugins: [],
}

if (process.env.BUILD_EXAMPLES) {
  config.plugins.push(new webpack.optimize.UglifyJsPlugin({
    compress: {
      warnings: false,
    },
  }))
  config.plugins.push(new webpack.DefinePlugin({
    'process.env.NODE_ENV': '"production"',
  }))
} else {
  config.devtool = 'sourcemap'
}

module.exports = config
