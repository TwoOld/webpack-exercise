import test from './test.jpg'
import './index.less'
console.log(test)

const img = new Image()
img.src = test
const root = document.getElementById('root')
root.append(img)

document.write('hi webpack!!!嗨')
console.log('change!!')
