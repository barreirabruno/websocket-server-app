import * as readline from 'readline'

const askOnCommandLine = async (message: any): Promise<any> =>
  await new Promise((resolve) => {
    const p = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      prompt: message
    })

    p.on('line', (input) => {
      resolve(input)
      p.close()
    })

    p.prompt()
  })

export const userAnswerInput = async (message: string): Promise<number> => {
  return await askOnCommandLine(message)
}
