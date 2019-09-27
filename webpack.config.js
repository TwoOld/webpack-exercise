const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const webpack = require('webpack')

module.exports = {
  //   entry: './src/index.js', // 入口文件
  entry: {
    index: './src/index.js',
    login: './src/login.js'
  },
  output: {
    // 输出结构
    path: path.resolve(__dirname, './dist'),
    filename: '[name].js'
    // filename: '[name].js'
  },
  mode: 'development', // 打包环境
  devtool: 'source-map',
  devServer: {
    contentBase: './dist',
    open: true,
    port: 8081,
    proxy: {
      '/api': {
        target: 'http://localhost:9092'
      }
    },
    hotOnly: true
  },
  module: {
    rules: [
      // loader模块处理 从下往上 从右向左执行
      {
        test: /\.(png|jpe?g|gif)$/,
        // use:'url-loader',
        // use使⽤⼀个loader可以⽤对象，字符串，两个loader需要⽤数组
        use: {
          loader: 'url-loader',
          // options额外的配置，⽐如资源名称
          options: {
            // placeholder 占位符 [name]⽼资源模块的名称
            // [ext]⽼资源模块的后缀
            name: '[name].[ext]',
            //打包后的存放位置
            outputPath: 'images/',
            limit: 2048
          }
        }
      },
      {
        test: /\.css$/,
        use: [
          // MiniCssExtractPlugin.loader,
          'style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.(woff2|woff)$/,
        // use:'url-loader',
        use: {
          loader: 'file-loader'
        }
      },
      {
        test: /\.less$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'less-loader',
          'postcss-loader'
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Home',
      template: './src/index.html',
      inject: true,
      chunks: ['index'],
      filename: 'index.html'
    }),
    new HtmlWebpackPlugin({
      title: 'Login',
      template: './src/index.html',
      inject: true,
      chunks: ['login'],
      filename: 'login.html'
    }),
    new CleanWebpackPlugin(),
    // new MiniCssExtractPlugin({
    //   filename: '[name]_[contenthash:8].css'
    // }),
    new webpack.HotModuleReplacementPlugin()
  ] // 插件配置
  //   watch: true, // 默认false
  //   watchOptions: {
  //     ignored: /node_modules/,
  //     // 监听到变化后，延迟300ms再去执行
  //     aggregateTimeout: 300,
  //     // 不停询问系统是否有文件变化，单位毫秒，默认每秒1次
  //     poll: 1000
  //   }
}
