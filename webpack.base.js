const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

const webpack = require('webpack')

const merge = require('webpack-merge')
const devConfig = require('./webpack.dev')
const prodConfig = require('./webpack.pro')

const commonConfig = {
  entry: {
    index: './src/index.jsx'
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Home',
      template: './src/index.html',
      inject: true,
      chunks: ['vendors~index', 'index'],
      filename: 'index.html'
    }),
    new CleanWebpackPlugin()
  ]
}

module.exports = env => {
  if (env && env.production) {
    return merge(commonConfig, prodConfig)
  } else {
    return merge(commonConfig, devConfig)
  }
}
