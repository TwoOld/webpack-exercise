const express = require('express')

const app = express()

app.get('/api/info', (req, res) => {
  res.json({
    name: 'Chiu',
    age: 29
  })
})

app.listen(9092)
