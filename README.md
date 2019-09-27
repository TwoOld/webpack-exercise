## Hot Module Replacement(HMR:热模块替换)

启动 hmr

```json
{
  "devServer": {
    "contentBase": "./dist",
    "open": true,
    "hot": true,
    //即便HMR不⽣效，浏览器也不⾃动刷新，就开启hotOnly
    "hotOnly": true
  }
}
```

配置⽂件头部引⼊ webpack

```js
const webpack = require('webpack')
```

在插件配置处添加：

```js
{
  "plugins": [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      "template": "src/index.html"
    }),
    new webpack.HotModuleReplacementPlugin()
  ]
}
```

使用

index.js

```js
import './index.css'

var btn = document.createElement('button')
btn.innerHTML = '新增'
document.body.appendChild(btn)
btn.onclick = function() {
  var div = document.createElement('div')
  div.innerHTML = 'item'
  document.body.appendChild(div)
}
```

index.css

```css
div:nth-of-type(odd) {
  background: yellow;
}
```

> 注意启动 HMR 后，css 抽离会不⽣效，还有不⽀持 contenthash，chunkhash

### 处理 js 模块 HMR

需要使⽤ module.hot.accept 来观察模块更新 从⽽更新

使用

counter.js

```js
function counter() {
  var div = document.createElement('div')
  div.setAttribute('id', 'counter')
  div.innerHTML = 1
  div.onclick = function() {
    div.innerHTML = parseInt(div.innerHTML, 10) + 1
  }
  document.body.appendChild(div)
}
export default counter
```

number.js

```js
function number() {
  var div = document.createElement('div')
  div.setAttribute('id', 'number')
  div.innerHTML = 13000
  document.body.appendChild(div)
}
export default number
```

index.js

```js
import counter from './counter'
import number from './number'

counter()
number()

if (module.hot) {
  module.hot.accept('./number', function() {
    document.body.removeChild(document.getElementById('number'))
    number()
  })
}
```

## Babel 处理 ES6

babel-loader 是 webpack 与 babel 的通信桥梁，不会做把 es6 转成 es5 的工作，这部分工作需要用到@babel/preset-env 来做

@babel/preset-env 里包含了 es6 转 es5 的转换规则

```shell
npm i babel-loader @babel/core @babel/preset-env -D
```

通过上⾯的⼏步 还不够，Promise 等⼀些还有转换过来，这时候需要借助@babel/polyfill，把 es 的新特性都装进来，来弥补低版本浏览器中缺失的特性

webpack.config.js

```json
{
  "test": /\.js$/,
  "exclude": /node_modules/,
  "loader": "babel-loader",
  "options": {
    "presets": ["@babel/preset-env"]
  }
}
```

index.js 顶部

```js
import '@babel/polyfill'
```

会发现打包的体积⼤了很多，这是因为 polyfill 默认会把所有特性注⼊进来，假如我想我⽤到的 es6+，才会注⼊，没⽤到的不注⼊，从⽽减少打包的体积，可不可以呢

当然可以

webpack.config.js

```json
{
  "loader": "babel-loader",
  "options": {
    "presets": [
      [
        "@babel/preset-env",
        {
          "targets": {
            "edge": "17",
            "firefox": "60",
            "chrome": "67",
            "safari": "11.1"
          },
          "useBuiltIns": "usage" //按需注⼊
        }
      ]
    ]
  }
}
```

> 不再需要 `import '@babel/polyfill'`

当我们开发的是组件库，⼯具库这些场景的时候，polyfill 就不适合了，因为 polyfill 是注⼊到全局变量，window 下的，会污染全局环境，所以推荐闭包⽅式：@babel/plugin-transform-runtime

### @babel/plugin-transform-runtime

它不会造成全局污染

```shell
npm install --save-dev @babel/plugin-transform-runtime

npm install --save @babel/runtime
```

修改配置⽂件：注释掉之前的 presets，添加 plugins

```json
{
  "plugins": [
    [
      "@babel/plugin-transform-runtime",
      {
        "absoluteRuntime": false,
        "corejs": false,
        "helpers": true,
        "regenerator": true,
        "useESModules": false
      }
    ]
  ]
}
```

useBuiltIns 选项是 babel 7 的新功能，这个选项告诉 babel 如何配置 @babel/polyfill 。 它有三个参数可以使⽤： ①entry: 需要在 webpack 的⼊⼝⽂件⾥ import "@babel/polyfill" ⼀次。 babel 会根据你的使⽤情况导⼊垫⽚，没有使⽤的功能不会被导⼊相应的垫⽚。②usage: 不需要 import ，全⾃动检测，但是要安装 @babel/polyfill 。（试验阶段） ③false: 如果你 import "@babel/polyfill" ，它不会排除掉没有使⽤的垫⽚，程序体积会庞⼤。(不推荐)

> 请注意： usage 的⾏为类似 babel-transform-runtime，不会造成全局污染，因此也会不会对类似 Array.prototype.includes() 进⾏ polyfill。

## tree Shaking

webpack2.x 开始⽀持 tree shaking 概念，顾名思义，"摇树"，只⽀持 ES module 的引⼊⽅式！！！！

webpack.config.js

```json
{
  "optimization": {
    "usedExports": true
  }
}
```

package.json

```json
{
  "sideEffects": ["*.css"]
}
```

> 开发模式设置后，不会帮助我们把没有引⽤的代码去掉
