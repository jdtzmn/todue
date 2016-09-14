const path = require('path')
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
console.log('Listening on port: ' + 3000)
