'use strict'

const inquirer = require('inquirer')
const FileManager = require('./fileManager')
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

GeneratorAsync.generate = async function generate() {
  try {
    const answers = await inquirer.prompt(prompts)
    const {
      ['project-name']: projectName,
      ['project-type']: projectType
     } = answers
    const templatePath = `${cwd}/src/templates/${projectType}`

    const makeDirResponse = await FileManager.createDirectory(`${cwd}/${projectName}`)
    if (makeDirResponse.successful) {
      await createDirectoryContents(templatePath, projectName)
      return Promise.resolve(true)
    } else {
      return Promise.reject(makeDirResponse.message)
    }
  } catch (e) {
    console.error(`Error generating project: ${e}`)
    return Promise.reject(e)
  }
}

async function createDirectoryContents(templatePath, projectPath) {
  try {
    const filesToCreate = await FileManager.readDirectory(templatePath)
    filesToCreate.forEach(async f => {
      const originalPath = `${templatePath}/${f}`
      const stats = await FileManager.stat(originalPath)

      if (stats.isFile()) {
        const contents = await FileManager.readFile(originalPath, 'utf8')

        if (file === '.npmignore') {
          file = '.gitignore'
        }

        const writePath = `${cwd}/${projectPath}/${f}`
        await FileManager.writeFile(writePath, contents, 'utf8')
      } else if (stats.isDirectory()) {
        await FileManager.createDirectory(`${cwd}/${projectPath}/${f}`)
        await createDirectoryContents(`${templatePath}/${f}`, `${projectPath}/${f}`)
      }
    })
  } catch (e) {
    console.error(`Error generating project from template: ${e}`)
    return Promise.reject(e)
  }
}

module.exports = GeneratorAsync
