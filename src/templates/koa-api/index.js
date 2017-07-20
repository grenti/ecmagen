const { ['app-name']: appName } = require('./src/constants')
const config = require('./src/config')
const { app } = require('./src/app')

const environment = process.env.NODE_ENV || 'development'
const { port } = config
let server

if (!module.parent) {
  server = app.listen(port, () => {
    if (['development', 'test'].includes(environment)) {
      console.log(`${appName} started on port: ${port}`)
    } else {
      console.log(`${appName} started`)
    }
  })
}

module.exports = { server }
