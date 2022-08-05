/* eslint-disable @typescript-eslint/no-var-requires */
const chalk = require('chalk')

const log = console.log

type Challenge = {
  question: string
  options: string[]
  correct: string
}

// type ChallengeParams = {
//   challenge: Challenge
// }

// export default class ChallengeService {
//   challenge: any

//   constructor (params: ChallengeParams) {
//     this.challenge = params.challenge
//   }

//   public mountChallenge (): void {
//     const questionParsed = JSON.parse(this.challenge.content.event)
//     const displayChallenge = Object.assign({}, { question: questionParsed.question, options: questionParsed.options })
//     log(chalk.black.bgGreenBright('[**** NEW CHALLENGE HAS ARRIVED *** ]'))
//     log(chalk.black.bgMagentaBright(displayChallenge.question))
//     displayChallenge.options.map((option: any, index: number) => {
//       // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
//       return log(`[${index}]: ${option}`)
//     })
//   }
// }

export const mountChallenge = (challenge: Challenge): void => {
  const displayChallenge = Object.assign({}, { question: challenge.question, options: challenge.options })
  // console.log('[MOUNT CHALLENGE]: ', displayChallenge)
  log(chalk.black.bgGreenBright('[**** NEW CHALLENGE HAS ARRIVED *** ]'))
  log(chalk.black.bgMagentaBright(displayChallenge.question))
  displayChallenge.options.map((option: any, index: number) => {
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    return log(`[${index}]: ${option}`)
  })
}
