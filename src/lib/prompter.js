const inquirer = require('inquirer')
const { prompts, directoryExists } = require('./prompts')

class Prompter {
  static async overrideDirectory() {
    try {
      const answer = await inquirer.prompt(directoryExists)
      const { ['directory-exists']: override } = answer
      console.log(`Inquirer Prompt Response: ${override}`)
      return Promise.resolve(override)
    } catch (e) {
      console.log(`Error confirming directory override: ${e}`)
      return Promise.reject(() => console.log('Could not ascertain directory information'))
    }
  }
  static async queryForProjectDetails() {
    try {
      const answers = await inquirer.prompt(prompts)
      return Promise.resolve(answers)
    } catch (e) {
      console.error(`Error getting project details from Inquirer module: ${e}`)
      return Promise.reject(e)
    }
  }
}

module.exports = Prompter
