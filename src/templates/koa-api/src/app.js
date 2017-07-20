const Koa = require('koa')
const bodyParser = require('koa-bodyparser')

const config = require('./config')
const ServerTiming = require('./middlewares/timings')
const { appErrorHandler: appError } = require('./middlewares/errors')
const { registrar: routeRegistrar } = require('./middleware/registrar')

app.use(bodyParser())

app.on('error', appErrorHandler)

app.use(ServerTiming.serverLog)
app.use(ServerTiming.httpHeader)

routeRegistrar(app)

module.exports = { app }
