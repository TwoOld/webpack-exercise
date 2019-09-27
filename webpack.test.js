const path = require('path')

module.exports = {
  //   entry: './src/index.js',
  entry: {
    main: './src/index.js'
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'main.js'
  },
  mode: 'production'
}
