const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const path = require('path')
const { secret } = require('../config/secrets.js')

// ======= EXPRESS MIDDLEWARES =======
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser(secret))
app.use(express.static(path.join(__dirname, '../dist')))

// ===================================
// ========== AUTHENTICATION =========
// ===================================

require('./auth')(app)

// ===================================
// ========== API ENDPOINTS ==========
// ===================================

// ==============================
// =========== ROUTES ===========
// ==============================

app.get('*', (req, res) => {
  console.log('yay')
  res.sendFile(path.join(__dirname, '../dist/index.html'))
})

// =========== LISTEN ===========

app.listen(3000)
console.log('Listening on port: ' + 3000)
