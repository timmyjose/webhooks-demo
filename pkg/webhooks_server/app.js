var createError = require('http-errors')
var express = require('express')
var path = require('path')
var cookieParser = require('cookie-parser')
var logger = require('morgan')

var indexRouter = require('./routes/index')
var usersRouter = require('./routes/users')

var app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use('/', indexRouter)
app.use('/users', usersRouter)

const WEBHOOKS_HANDLER_URL = 'https://6c27-103-5-134-18.ngrok-free.app/webhook'

app.post('/webhook', async (req, res) => {
  console.warn(`Webhook request received: ${JSON.stringify(req.body)}`)

  const fetch = (await import('node-fetch')).default

  // send a POST to the webhooks handler
  const user = {
    name: req.body.name,
    age: Number(req.body.age)
  }

  setTimeout(async () => {
    console.log('Sending user payload to the WebHooks handler...')
    try {
      const backendRes = await fetch(WEBHOOKS_HANDLER_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user)
      })

      console.log('Backend res = ', backendRes)
      if (backendRes.ok) {
        res.status(200).send('Processed webhooks call')
      } else {
        res.status(500).send('Failed to send user to webhooks handler')
      }
    } catch (err) {
        console.error(err)
        res.status(500).send('Internal Server Error')
    }
    }, 5000)
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404))
})

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app
