'use strict'

const fs = require('fs')
const fsExtra = require('fs-extra')
const inquirer = require('inquirer')
const Prompter = require('./prompter')
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
    const made = await promisedMkDir(directoryPath)
    if (!made) {
      console.log('Done Creating Folder')
      return Promise.resolve({ successful: true, message: 'Created folder' })
    }
  } catch (e) {
    if (e.code === 'EEXIST') {
      const shouldOverride = await Prompter.overrideDirectory()
      console.log(`ShouldOverride: ${shouldOverride}`)
      if (shouldOverride) {
        const successful = await FileManager.removeDirectory(directoryPath)
        console.log(`Folder deletion successful: ${successful}`)
        if (successful) {
          console.log('Recursively calling createDirectory again')
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

FileManager.removeDirectorySync = directoryPath => {
  console.log(`Deleting ${directoryPath}`)
  fsExtra.removeSync(directoryPath)
  console.log(`Deletion done`)
}

FileManager.removeDirectory = async directoryPath => {
  try {
    console.log('Deleting Directory...')
    const result = await fsExtra.remove(directoryPath)
    if (!result) {
      console.log('Done deleting directory')
      return Promise.resolve(true)
    }
  } catch (e) {
    console.error(`Error while trying to delete directory: ${e}`)
    return Promise.reject(e)
  }
}

FileManager.readDirectory = async dirPath => {
  try {
    const directory = await promisedReadDir(dirPath)
    return Promise.resolve(directory)
  } catch (e) {
    console.error(`Error reading directory: ${e}`)
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

FileManager.stat = async filePath => {
  try {
    const stats = await promisedStat(filePath)
    return Promise.resolve(stats)
  } catch (e) {
    console.error(`Error getting file/dir stats: ${e}`)
    return Promise.reject(e)
  }
}

FileManager.readFile = async (filePath, encoding) => {
  try {
    const file = promisedReadFile(filePath, encoding)
    return Promise.resolve(file)
  } catch (e) {
    console.error(`Error reading file: ${e}`)
    return Promise.reject(e)
  }
}

FileManager.writeFile = async (filePath, encoding) => {
  try {
    const file = promisedWriteFile(filePath, encoding)
    return Promise.resolve(file)
  } catch (e) {
    console.error(`Error writing to file: ${e}`)
    return Promise.reject(e)
  }
}

module.exports = FileManager
