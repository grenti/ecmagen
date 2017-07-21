const Generator = require('./src/lib/generator')

Generator.generate()
  .then(success => {
    if (success) {
      console.log('Done!')
    }
  })
  .catch(e => {
    console.error(`Error generating project template. Error: ${e}`)
  })
