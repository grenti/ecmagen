const homeRouter = require('../routes')
const Boom = require('boom')

function registrar(app) {
  app.use(homeRouter.routes())
  app.use(homeRouter.allowedMethods({
    throw: true,
    notImplemented() { return Boom.notImplemented('Route not implemented') },
    methodNotAllowed() { return Boom.methodNotAllowed('Method not allowed') }
  }))
}

module.exports = { registrar }
