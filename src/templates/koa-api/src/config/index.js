const development = require('./environments/development')
const test = require('./environments/test')
const staging = require('./environments/staging')
const production = require('./environments/production')
const all = require('./environments/all')
const environment = process.env.NODE_ENV || 'development'

function getEnvironment(env) {
  switch (env) {
    case 'development':
      return development
      break
    case 'test':
      return test
      break
    case 'staging':
      return staging
      break
    case 'production':
      return production
      break
    default:
      return development
      break
  }
}

module.exports = Object.assign({}, all, getEnvironment(environment))
