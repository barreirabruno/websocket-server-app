/* eslint-disable @typescript-eslint/no-var-requires */
const { stdin } = process

async function prompt (): Promise<number> {
  return await new Promise((resolve, reject) => {
    stdin.on('data', function (data) {
      const userData = parseInt(data.toString().trim())
      resolve(userData)
    })
    stdin.on('error', err => {
      console.log('[REJECT]: ', err)
      reject(err)
    })
  })
}

export const mainMenuInput = async (): Promise<number> => {
  return await prompt()
}
