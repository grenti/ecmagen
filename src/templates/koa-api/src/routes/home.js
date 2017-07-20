const Router = require('koa-router')
const homeRouter = new Router({ prefix: '/' })
const Controller = require('../controllers/home')

homeRouter.get('/', Controller.index)

module.exports = homeRouter
