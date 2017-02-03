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
const stormpath = require('express-stormpath')
const port = process.env.PORT || 3000

app.use(express.static(path.join(__dirname, '/www/dist')))
app.use(stormpath.init(app, {
  website: true,
  expand: {
    customData: true
  }
}))
app.set('view engine', 'pug')

app.get('/', stormpath.getUser, (req, res) => {
  res.render('index', {user: req.user})
})

app.get('/tasks/get', stormpath.authenticationRequired, (req, res) => {
  res.send(req.user.customData.tasks)
})

app.get('/tasks/set', stormpath.authenticationRequired, (req, res) => {
  console.log(req.user.href.split('/')[5])
  req.user.customData.tasks = req.query.tasks
  req.user.customData.save((err) => {
    if (err) {
      res.status(400).end('Error: ' + err.userMessage)
    } else {
      res.send(req.user.customData.tasks)
    }
  })
})

io.on('connection', (socket) => {
  console.log('Socket connected!')

  socket.on('disconnect', () => {
    console.log('Socket disconnected!')
  })
})

app.on('stormpath.ready', () => {
  server.listen(port)
  console.log('Listening on: ' + address + ':' + server.address().port)
})
