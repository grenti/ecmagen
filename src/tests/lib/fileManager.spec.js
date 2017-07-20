const test = require('tape')
const FileManager = require('../../lib/fileManager')
const path = require('path')
const inquirer = require('inquirer')
const sinon = require('sinon')

const cwd = process.cwd()
const testPath = path.resolve(cwd, 'src', 'tests', 'lib', 'test')

test('Fail to create test folder', t => {
  const stub = sinon.stub(inquirer, 'prompt')
  stub.callsFake(async () => await false)
  FileManager
    .createDirectory(testPath)
    .then(response => {
      console.log('Promise Returned from FileManager:' + response.successful)
      t.equals(response.message, 'You declined overriding current directory')
      t.false(response.successful, '/test folder should not have been created')
      stub.restore()
      t.end()
    })
    .catch(e => {
      t.fail('Error should not have been thrown while failing to create folder')
      stub.restore()
      t.end()
    })
})

test('Delete test folder successfully', t => {
  FileManager
    .removeDirectory(testPath)
    .then(successful => {
      t.true(successful, '/test folder should have been deleted successfully')
      t.end()
    })
    .catch(e => {
      t.fail('Error should not have been thrown while successfully deleting folder')
      t.end()
    })
})

test('Create test folder successfully', t => {
  const stub = sinon.stub(inquirer, 'prompt')
  stub.callsFake(async () => await true)
  FileManager
    .createDirectory(testPath)
    .then(response => {
      t.true(response.successful, '/test folder should have been deleted successfully')
      stub.restore()
      t.end()
    })
    .catch(e => {
      t.fail('Error should not have been thrown while successfully deleting folder')
      stub.restore()
      t.end()
    })
})
