const { TYPES } = require('../constants/lists')

const projectType = {
  name: 'project-type',
  type: 'list',
  message: 'What project template would you like to generate?',
  choices: TYPES
}

const projectName = {
  name: 'project-name',
  type: 'input',
  message: 'Project name:',
  validate: input =>
    (/^([A-Za-z\-\_\d])+$/.test(input)) ||
    'Project name may only include letters, numbers, underscores or hashes.'
}

const directoryExists = {
  name: 'directory-exists',
  type: 'confirm',
  message: 'Directory already exists. Would you like to override?',
  validate: input =>
    (/^(YyNn01)/.test(input)) || 'Please answer Y or N'
}

module.exports = {
  prompts: [projectType, projectName],
  directoryExists
}
