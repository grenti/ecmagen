const { ['api-version']: apiVersion } = require('../constants')

const version = () => '/' + apiVersion

module.exports = { version }
