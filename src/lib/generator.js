const inquirer = require('inquirer')
const fs = require('fs')
const { prompts, directoryExists } = require('./prompts')

const cwd = process.cwd()

function Generator() { }

Generator.generate = function generate() {
  try {
    inquirer.prompt(prompts)
    const {
      ['project-name']: projectName,
      ['project-type']: projectType
     } = answers
    const templatePath = `${__dirname}/templates/${projectType}`

    fs.mkdirSync(`${cwd}/${projectName}`)

    createDirectoryContents(templatePath, projectName)
  } catch (e) {
    console.error(`Error getting answers from Inquirer Module: ${e}`)
  }
}

// function createDirectory(directoryPath) {
//   try {
//     fs.mkdirSync(`${cwd}/${projectName}`)
//   } catch (e) {
//     inquirer.prompt(directoryExists)
//   }
// }

function createDirectoryContents(templatePath, projectPath) {
  try {
    const filesToCreate = fs.readdirSync(templatePath)
    filesToCreate.forEach(f => {
      const originalPath = `${templatePath}/${f}`
      const stats = fs.statSync(originalPath)

      if (stats.isFile()) {
        const contents = fs.readFileSync(originalPath, 'utf8')
        const writePath = `${cwd}/${projectPath}/${f}`
        fs.writeFileSync(writePath, contents, 'utf8')
      } else if (stats.isDirectory()) {
        fs.mkdirSync(`${cwd}/${projectPath}/${f}`)
        createDirectoryContents(`${templatePath}/${f}`, `${projectPath}/${f}`)
      }
    })
  } catch (e) {
    console.error(`Error generating project from template: ${e}`)
  }
}

module.exports = Generator
