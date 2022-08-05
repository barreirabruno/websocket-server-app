/* eslint-disable @typescript-eslint/no-var-requires */
const chalk = require('chalk')

const log = console.log

export const challengeCheckMessage = (resultMessage: string, isCorrect: boolean): void => {
  if (!isCorrect) {
    log(chalk.white.bgRedBright(resultMessage))
  } else {
    log(chalk.black.bgYellowBright(resultMessage))
  }
}
