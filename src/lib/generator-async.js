const inquirer = require('inquirer')
const fs = require('fs')
const { promisify } = require('util')
const { prompts } = require('./prompts')

const cwd = process.cwd()
const promisedMkDir = promisify(fs.mkdir)
const promisedReadDir = promisify(fs.readdir)
const promisedStat = promisify(fs.stat)
const promisedReadFile = promisify(fs.readFile)
const promisedWriteFile = promisify(fs.writeFile)

function GeneratorAsync() { }

Generator.generate = async function generate() {
  try {
    const answers = await inquirer.prompt(prompts)
    const {
      ['project-name']: projectName,
      ['project-type']: projectType
     } = answers
    const templatePath = `${__dirname}/templates/${projectType}`

    await promisedMkDir(`${cwd}/${projectName}`)

    await createDirectoryContents(templatePath, projectName)
  } catch (e) {
    console.error(`Error getting answers from Inquirer Module: ${e}`)
  }
}

async function createDirectoryContents(templatePath, projectPath) {
  try {
    const filesToCreate = await promisedReadDir(templatePath)
    filesToCreate.forEach(async f => {
      const originalPath = `${templatePath}/${f}`
      const stats = await promisedStat(originalPath)

      if (stats.isFile()) {
        const contents = await promisedReadFile(originalPath, 'utf8')
        const writePath = `${cwd}/${projectPath}/${f}`
        await promisedWriteFile(writePath, contents, 'utf8')
      } else if (stats.isDirectory()) {
        await promisedMkDir(`${cwd}/${projectPath}/${f}`)
        createDirectoryContents(`${templatePath}/${f}`, `${projectPath}/${f}`)
      }
    })
  } catch (e) {
    console.error(`Error generating project from template: ${e}`)
  }
}

module.exports = GeneratorAsync
