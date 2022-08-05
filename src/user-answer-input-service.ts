/* eslint-disable @typescript-eslint/no-var-requires */
const { stdin } = process
const chalk = require('chalk')

const log = console.log

async function prompt (): Promise<number> {
  return await new Promise((resolve, reject) => {
    log(chalk.black.bgGreenBright('[**** TYPE THE NUMBER OF YOUR ANSWER *** ]'))

    stdin.on('data', function (data) {
      const userData = parseInt(data.toString().trim())
      log(chalk.black.bgGreenBright('[YOU CHOOSE OPTION] '), userData)
      log(chalk.black.bgGreenBright('[--- LETS CHECK ---]] '))
      resolve(userData)
    })
    stdin.on('error', err => reject(err))
  })
}

export const userAnswerInput = async (): Promise<number> => {
  return await prompt()
}
