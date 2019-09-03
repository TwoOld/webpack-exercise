# webpack 是什么

webpack is a module bundler.(模块打包工具)

Webpack 可以看作是模块打包机：它做的事情是，分析你的项目结构，找到 JavaScript 模块一起其它的一些浏览器不能直接运行的扩展语言(Scss, TypeScript 等)，并将其打包为合适的格式以供浏览器使用。

- [官方网站](https://webpack.js.org/)

# 安装

- 环境：[nodejs](https://nodejs.org/en/)

  版本参考官网发布的最新版本，可以提升 webpack 的打包速度

- 全局 不推荐

- 局部安装 项目内安装

  `npm i webpack webpack-cli -D`

- 安装指定版本

  ```shell
  #查看历史版本
  webpack info

  #安装指定版本
  npm i webpack@xx.xx webpack-cli -D
  ```

# 测试：启动 webpack 打包

打包命令，使用 webpack 处理 src/index.js 这个文件

`npx webpack`

webpack 是一个模块打包工具，可以识别出引用模块的语法，早期的 webpack 只是个 js 模块的打包工具，现在可以是 css, png, vue 的模块打包工具

# webpack 配置文件

零配置是很弱的，特定的需求，总是需要自己进行配置

```js
const path = require('path')

module.exports = {
  entry: './src/index.js', // 默认的入口文件
  output: {
    // 默认的输出
    path: path.resolve(__dirname, './dist'),
    filename: 'main.js'
  },
  mode: 'development'
}
```

当我们使用 npm webpack，表示的是使用 webpack 处理打包，./src/index.js 的入口模块。默认放在当前目录下的 dist 目录，打包后的模块名称是 main.js，当然我们也可以进行修改。

webpack 有默认的配置文件 webpack.config.js, 我们可以对这个文件进行修改，进行个性化配置。

- 默认的配置文件：webpack.config.js

  ```shell
  #执行命令后，webpack会找到默认的配置文件，并使用执行
  npx webpack
  ```

- 不使用默认的配置文件：webpackconfig.js

  ```shell
  #指定webpack使用webpackconfig.js文件作为配置文件并执行
  npx webpack --config webpackconfig.js
  ```

- 修改 package.json scripts 字段：使用 npm run 来启动，**原理是模块局部安装会在 node_modules/.bin 目录下创建一个软连接**

  ```js
  {
      "scripts": {
          "bundle": "webpack"
      }
  }
  ```

  ```shell
  npm run dev
  ```

- webpack.config.js 配置结构

  ```js
  const path = require('path')

  module.exports = {
    entry: './src/index.js', // 入口文件
    output: {
      // 输出结构
      path: path.resolve(__dirname, './dist'),
      filename: 'main.js'
    },
    mode: 'development', // 打包环境
    module: {
      rules: [
        // loader模块处理
        {
          test: /\.css$/,
          use: 'style-loader'
        }
      ]
    },
    plugins: [new HtmlWebpackPlugin()] // 插件配置
  }
  ```

# webpack 的核心概念

## entry

指定 webpack 打包入口文件：webpack 执行构建的第一步将从 entry 开始，可抽象成输入

```js
// 单入口 SPA，本质是个字符串
entry: {
    main: './src/index.js'
}
// 简写
entry: './src/index.js'

// 多入口 entry是个对象
entry: {
    index: './src/index.js',
    login: './src/login.js'
}
```

## output

打包转换后的文件输出到磁盘位置，输出结果，在 webpack 经过一系列处理并得出最终想要的代码后输出结果

```js
{
  output: {
    // 输出结构
    path: path.resolve(__dirname, './dist'),
    filename: 'bundle.js'
  },
}

// 利用占位符
{
  output: {
    // 输出结构
    path: path.resolve(__dirname, './dist'),
    filename: '[name]_[chunkhash:8].js'
  },
}
```

## mode

用来指定当前的构建环境

- production
- development
- none

设置 mode 可以自动出发 webpack 内置的函数，达到优化的效果

- development

  会将 DefinePlugin 中 process.env.NODE_ENV 的值设置为 development。启用 NamedChunksPlugin 和 NamedModulesPlugin。作用热更新。

- production

  会将 DefinePlugin 中 process.env.NODE_ENV 的值设置为 production。启动一系列插件。作用压缩优化去无用。

> 如果没有设置，默认设置为 production

## loader

模块解析，模块转换器，用于把模块原内容按照需求转成新内容

webpack 是模块打包工具，而模块不仅仅是 js，还可以是 css，图片或其他格式

但是 webpack 默认只知道如何处理 js 和 json 模块，那么其他格式的模块处理，和处理方式就需要 loader 了

loader 有顺序，从右到左，从下到上

常见的 loader

```shell
style-loader
css-loader
less-loader
sass-loader
ts-loader #ts转换成js
babel-loader #转换es6/7等js新特性语法
file-loader #处理图片字符
eslint-loader
```

## module

模块，在 webpack 里一切皆模块，一个模块对应着一个文件。webpack 会从配置的 entry 开始递归找出所有依赖的模块。

```js
{
  module: {
    rules: [
      {
        test: /\.xxx$/, // 指定匹配规则
        use: {
          loader: 'xxx-loader' // 指定使用loader
        }
      }
    ]
  }
}
```

当 webpack 处理到不认识的模块时，需要在 webpack 的 module 处进行配置，当检测到是什么格式的模块，使用什么 loader 来处理

- file-loader 处理静态资源模块

  原理是把打包入口中识别出的资源模块，移动到输出目录，并且返回一个地址名称

  是什么时候使用 file-loader?

  场景：就是当我们需要模块，仅仅是从源代码挪移到打包⽬录，就可以使⽤ file-loader 来处理，txt，svg，csv，excel，图⽚资源啦等等

  ```js
  {
    module: {
      rules: [
        // loader模块处理 从下往上 从右向左执行
        {
          test: /\.(png|jpe?g|gif)$/,
          // use使⽤⼀个loader可以⽤对象，字符串，两个loader需要⽤数组
          use: {
            loader: 'file-loader',
            // options额外的配置，⽐如资源名称
            options: {
              // placeholder 占位符 [name]⽼资源模块的名称
              // [ext]⽼资源模块的后缀
              name: '[name].[ext]',
              //打包后的存放位置
              outputPath: 'images/'
            }
          }
        }
      ]
    }
  }
  ```

  - 处理字体

    ```css
    @font-face {
      font-family: 'webfont';
      font-display: swap;
      src: url('webfont.woff2') format('woff2');
    }
    ```

    ```js
    {
      test: /\.(eot|ttf|woff|woff2|svg)$/,
      use: "file-loader"
    }
    ```

- url-loader

  url-loader 内部使⽤了 file-loader,所以可以处理 file-loader 所有的事情，但是遇到 jpg 格式的模块，会把该图⽚转换成 base64 格式字符串，并打包到 js ⾥。对⼩体积的图⽚⽐较合适，⼤图⽚不合适。

  ```js
  {
    module: {
      rules: [
        {
          test: /\.(png|jpe?g|gif)$/,
          use: {
            loader: 'url-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'images/',
              // ⼩于2048 byte，才转换成base64
              limit: 2048
            }
          }
        }
      ]
    }
  }
  ```

## 文件监听

轮询判断⽂件的最后编辑时间是否变化，某个⽂件发⽣了变化，并不会⽴刻告诉监听者，先缓存起来

webpack 开启监听模式，有两种

```js
{
  // 1.启动webpack命令式 带上--watch 参数，启动监听后，需要⼿动刷新浏览器
  scripts: {
    watch: 'webpack --watch'
  },
  // 2.在配置⽂件⾥设置 watch:true
  watch: true, //默认false,不开启
  //配合watch,只有开启才有作⽤
  watchOptions: {
    //默认为空，不监听的⽂件或者⽬录，⽀持正则
    ignored: /node_modules/,
    //监听到⽂件变化后，等300ms再去执⾏，默认300ms,
    aggregateTimeout: 300,
    //判断⽂件是否发⽣变化是通过不停的询问系统指定⽂件有没有变化，默认每秒问1次
    poll: 1000 //ms
  }
}
```

## 样式处理

Css-loader 分析 css 模块之间的关系，并合成⼀个 css

Style-loader 会把 css-loader ⽣成的内容，以 style 挂载到⻚⾯的 heade 部分

```js
{
  test: /\.css$/,
  use: ["style-loader", "css-loader"]
}
```

- less 样式处理

  less-loader 把 less 语法转换成 css

  ```js
  {
    test: /\.scss$/,
    use: ["style-loader", "css-loader", "less-loader"]
  }
  ```

- postcss-loader 样式⾃动添加前缀

  ```js
  {
    test: /\.css$/,
    use: ["style-loader", "css-loader", "postcss-loader"]
  }
  ```

  新建 postcss.config.js

  ```js
  module.exports = {
    plugins: [
      require('autoprefixer')({
        overrideBrowserslist: ['last 2 versions', '>1%']
      })
    ]
  }
  ```

## plugins

plugin 可以在 webpack 运⾏到某个阶段的时候，帮你做⼀些事情，类似于⽣命周期的概念

扩展插件，在 Webpack 构建流程中的特定时机注⼊扩展逻辑来改变构建结果或做你想要的事情。

作⽤于整个构建过程

### HtmlWebpackPlugin

htmlwebpackplugin 会在打包结束后，⾃动⽣成⼀个 html ⽂件，并把打包⽣成的 js 模块引⼊到该 html 中。

可选配置

```json
title: ⽤来⽣成⻚⾯的 title 元素
filename: 输出的 HTML ⽂件名，默认是 index.html, 也可以直接配置带有⼦⽬录。
template: 模板⽂件路径，⽀持加载器，⽐如 html!./index.html
inject: true | 'head' | 'body' | false ,注⼊所有的资源到特定的 template 或者 templateContent 中，如果设置为 true 或者
body，所有的 javascript 资源将被放置到 body 元素的底部，'head' 将放置到 head 元素中。
favicon: 添加特定的 favicon 路径到输出的 HTML ⽂件中。
minify: {} | false , 传递 html-minifier 选项给 minify 输出
hash: true | false, 如果为 true, 将添加⼀个唯⼀的 webpack 编译
hash 到所有包含的脚本和 CSS ⽂件，对于解除 cache 很有⽤。
cache: true | false，如果为 true, 这是默认值，仅仅在⽂件修改之后才会发布⽂件。
showErrors: true | false, 如果为 true, 这是默认值，错误信息会写⼊到 HTML ⻚⾯中
chunks: 允许只添加某些块 (⽐如，仅仅 unit test 块)
chunksSortMode: 允许控制块在添加到⻚⾯之前的排序⽅式，⽀持的值：'none' | 'default' | {function}-default:'auto'
excludeChunks: 允许跳过某些块，(⽐如，跳过单元测试的块)
```

使用

```js
const htmlWebpackPlugin = require('html-webpack-plugin')

{
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Home',
      template: './src/index.html',
      inject: true
    })
  ]
}
```

### clean-webpack-plugin

清除输出目录

```js
const { CleanWebpackPlugin } = require('clean-webpackplugin')

{
  plugins: [new CleanWebpackPlugin()]
}
```

### mini-css-extract-plugin

用于抽取 css 文件

```js
const MiniCssExtractPlugin = require("mini-css-extractplugin")

{
  test: /\.css$/,
  use: [MiniCssExtractPlugin.loader, "css-loader"]
}

{
  plugins: [new MiniCssExtractPlugin({ filename: "[name][chunkhash:8].css" })]
}
```
