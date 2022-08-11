/* eslint-disable @typescript-eslint/no-var-requires */
import fliget from 'figlet'
const chalk = require('chalk')
const log = console.log

export const createMainMenu = (menu: string): void => {
  fliget('BEM VINDO AO JOGO', {
    font: 'Standard',
    horizontalLayout: 'default',
    verticalLayout: 'default',
    whitespaceBreak: true
  }, function (err, data) {
    if (err != null) {
      console.log('OOPS, Something went wrong')
      console.dir(err)
    }
    log(chalk.black.bgCyan(data))
    log(chalk.black.bgCyan(menu))
  })
}
