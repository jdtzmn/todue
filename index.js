const path = require('path')
const address = Object.keys(
  require('os').networkInterfaces()
).map((k) => {
  return (require('os').networkInterfaces())[k]
}).filter((val, index, arr) => {
  for (var i in arr[index]) {
    if (arr[index][i].family === 'IPv4' && !arr[index][i].internal) {
      arr[index][i] = arr[index][i].address
      return true
    }
  }
  return false
})[0].filter((v) => { return typeof v === 'string' })
const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const port = process.env.PORT || 3000

app.use(express.static(path.join(__dirname, '/www/dist')))
app.set('view engine', 'pug')

app.get('/', (req, res) => {
  res.render('index')
})

io.on('connection', (socket) => {
  console.log('Socket connected!')

  socket.on('disconnect', () => {
    console.log('Socket disconnected!')
  })
})

server.listen(port)
console.log('Listening on: ' + address + ':' + server.address().port)
