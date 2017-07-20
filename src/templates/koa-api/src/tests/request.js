const supertest = require('supertest')
const { app } = require('../app')
const config = require('../config')

let server = app.listen(config.port)
const request = supertest(server)

module.exports = { request, server }
