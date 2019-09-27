// import './index.css'
// import counter from './counter'
// import number from './number'

// var btn = document.createElement('button')
// btn.innerHTML = '新增'
// document.body.appendChild(btn)
// btn.onclick = function() {
//   var div = document.createElement('div')
//   div.innerHTML = 'item'
//   document.body.appendChild(div)
// }

// counter()
// number()

// if (module.hot) {
//   module.hot.accept('./number', function() {
//     document.body.removeChild(document.getElementById('number'))
//     number()
//   })
// }

// import '@babel/polyfill'

// const arr = [new Promise(() => {}), new Promise(() => {})]

// arr.map(item => {
//   console.log(item)
// })

import React, { Component } from 'react'
import ReactDom from 'react-dom'

class App extends Component {
  render() {
    return <div>hello world</div>
  }
}

ReactDom.render(<App />, document.getElementById('root'))

// import { add } from './counter'
// import './index.css'

// document.write(add(1, 2))
