const jwt = require('jsonwebtoken')
const config = require('../config/secrets.js')
const { email, secret } = config
const gator = require('gators')(email)

module.exports = (app) => {
  // start up email client
  gator.connect()

  gator.on('connected', () => console.log('Email connection: Established'))

  // send carriers list
  app.get('/auth/carriers', (req, res) => res.json(gator._carriers))

  // set up send route
  app.post('/auth/send', (req, res) => {
    if (req.body.number && req.body.carrier) {
      // generate code
      const code = Math.random().toString().substr(-6)
      console.log(code)
      // send the code in a text
      gator.sendText(+req.body.number, req.body.carrier, 'Your code is: ' + code, (err, info) => {
        if (err) return res.status(500).send(err)
        let sub = req.body.number
        let headerAndPayload = jwt.sign({ sub }, secret, { expiresIn: '2m' })
        let signature = jwt.sign({ code, sub }, secret, { expiresIn: '2m' })
        res.send(headerAndPayload.split('.').slice(0, 2).join('.') + '.' + signature.split('.')[2])
      })
    } else {
      res.sendStatus(401)
    }
  })

  // set up login route
  app.post('/auth/login', (req, res) => {
    jwt.verify(req.body.token, secret, (err, payload) => {
      if (err) {
        res.sendStatus(401)
      } else if (payload.code) {
        let xsrfToken = Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2)
        let jwtToken = jwt.sign({ sub: payload.sub, xsrfToken }, secret, { expiresIn: '1h' })

        // set jwt cookie options
        let jwtCookieOptions = {
          maxAge: 1000 * 60 * 60,
          httpOnly: true,
          signed: true
        }

        // set xsrf cookie options
        let xsrfCookieOptions = { maxAge: 1000 * 60 * 60 }

        // send cookies
        res.cookie('token', jwtToken, jwtCookieOptions)
        res.cookie('xsrf', xsrfToken, xsrfCookieOptions)
        res.sendStatus(200)
      } else {
        res.sendStatus(400)
      }
    })
  })

  // test api
  app.get('/api/test', (req, res) => {
    console.log(req.signedCookies)
    console.log(req.headers['x-csrf-token'])
    jwt.verify(req.signedCookies.token, secret, (err, payload) => {
      console.log(payload.xsrfToken)
      if (err || req.headers['x-csrf-token'] !== payload.xsrfToken) {
        return res.sendStatus(401)
      }
      res.send('YAY')
    })
  })
}
