process.env.NODE_ENV = 'test'
const glob = require('glob')
const pattern = 'src/tests/**/*.spec.js'
const { resolve } = require('path')

const cwd = process.cwd()

glob(pattern, (err, files) => {
  if (err) {
    return console.error(`Test Runner Failed with error: ${e}`)
  }

  const files = promisedGlob(pattern)
  files.forEach(f => {
    console.log(`Executing require('${f}')`)
    require(resolve(cwd, f))
  })
})
