const fs = require('fs')
const inquirer = require('inquirer')
const { directoryExists } = require('./prompts')
const { promisify } = require('util')
const promisedMkDir = promisify(fs.mkdir)
const promisedReadDir = promisify(fs.readdir)
const promisedStat = promisify(fs.stat)
const promisedReadFile = promisify(fs.readFile)
const promisedWriteFile = promisify(fs.writeFile)
const promisedRmDir = promisify(fs.rmdir)
const promisedUnlinkFile = promisify(fs.unlink)

function FileManager() { }

FileManager.createDirectory = async directoryPath => {
  try {
    await promisedMkDir(directoryPath)
    return Promise.resolve({ successful: true, message: 'Created folder' })
  } catch (e) {
    if (e.code === 'EEXIST') {
      const shouldOverride = await FileManager.directoryExistsPrompt()
      if (shouldOverride) {
        const successful = await FileManager.removeDirectory(directoryPath)
        if (successful) {
          await FileManager.createDirectory(directoryPath)
        } else {
          return Promise.reject({ successful: false, message: 'Could not delete existing folder' })
        }
      } else {
        return Promise.resolve({ successful: false, message: 'You declined overriding current directory' })
      }
    } else if (e.code === 'EACCESS') {
      return Promise.resolve({ successful: false, message: 'You do not have permissions to create a project here.' })
    } else if (e.code === 'ENOENT') {
      return Promise.resolve({ successful: false, message: 'Path provided is invalid, please check it.' })
    } else {
      // console.log(`Error Code: ${e.code}`)
      // console.log(`Error Message: ${e}`)
      return Promise.reject({ successful: false, message: 'Could not create directory or file' })
    }
  }
}

FileManager.directoryExistsPrompt = async () => {
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

FileManager.removeDirectory = async directoryPath => {
  try {
    await promisedRmDir(directoryPath)
    return Promise.resolve(true)
  } catch (e) {
    console.error(`Error while trying to delete directory: ${e}`)
    return Promise.reject(e)
  }
}

FileManager.unlinkFile = async filePath => {
  try {
    await promisedUnlinkFile(filePath)
    return Promise.resolve(true)
  } catch (e) {
    console.error(`Error while trying to delete file: ${e}`)
    return Promise.reject(e)
  }
}

module.exports = FileManager
