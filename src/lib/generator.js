const inquirer = require('inquirer')
const fs = require('fs')
const Prompter = require('./prompter')
const FileManager = require('./fileManager')

const cwd = process.cwd()

function Generator() { }

Generator.generate = async function generate() {
  try {
    const answers = await Prompter.queryForProjectDetails()
    const {
      ['project-name']: projectName,
      ['project-type']: projectType
     } = answers
    const templatePath = `${cwd}/src/templates/${projectType}`

    const result = await makeDirectory(`${cwd}/${projectName}`)

    if (!result) {
      createDirectoryContents(templatePath, projectName)
      return Promise.resolve(true)
    }
  } catch (e) {
    console.error(`Error generating project: ${e}`)
    return Promise.reject(e)
  }
}

async function makeDirectory(directoryPath) {
  try {
    fs.mkdirSync(directoryPath)
  } catch (e) {
    if (e.code === 'EEXIST') {
      const shouldOverride = await Prompter.overrideDirectory()
      console.log(`ShouldOverride: ${shouldOverride}`)
      if (shouldOverride) {
        FileManager.removeDirectorySync(directoryPath)
        console.log('Recursively calling createDirectory again')
        makeDirectory(directoryPath)
      } else {
        return console.log('You declined overriding current directory')
      }
    } else if (e.code === 'EACCESS') {
      return console.log('You do not have permissions to create a project here.')
    } else if (e.code === 'ENOENT') {
      return console.log('Path provided is invalid, please check it.')
    } else {
      return console.log('Could not create directory or file')
    }
  }
}

function createDirectoryContents(templatePath, projectPath) {
  try {
    const filesToCreate = fs.readdirSync(templatePath)
    filesToCreate.forEach(file => {
      const originalPath = `${templatePath}/${file}`
      const stats = fs.statSync(originalPath)
      const writePath = `${cwd}/${projectPath}/${file}`
      if (stats.isFile()) {
        const contents = fs.readFileSync(originalPath, 'utf8')

        if (file === '.npmignore') {
          file = '.gitignore'
        }

        fs.writeFileSync(writePath, contents, 'utf8')
      } else if (stats.isDirectory()) {
        fs.mkdirSync(writePath)
        createDirectoryContents(`${templatePath}/${file}`, `${projectPath}/${file}`)
      }
    })
  } catch (e) {
    console.error(`Error generating project from template: ${e}`)
    throw e
  }
}

module.exports = Generator
