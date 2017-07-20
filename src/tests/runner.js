process.env.NODE_ENV = 'test'
const glob = require('glob')
const { resolve } = require('path')
const { promisify } = require('util')

const pattern = 'src/tests/**/*.spec.js'
const cwd = process.cwd()
const promisedGlob = promisify(glob)

async function runner() {
  try {
    const files = await promisedGlob(pattern)
    files.forEach(f => {
      console.log(`Executing require('${f}')`)
      require(resolve(cwd, f))
    })
    return Promise.resolve(true)
  } catch (e) {
    return Promise.reject(`Error running tests based on glob pattern. ${e}`)
  }
}

runner()
  .then(success => {
    console.log(success ?
      'Test Suite Executed Successfully' :
      'Test Suite Executed with failure')
  })
  .catch(e => {
    console.log('Test Suite caught an error')
    console.log(`Error: ${e}`)
  })
