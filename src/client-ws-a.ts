/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable no-case-declarations */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-base-to-string */
import WebSocket from 'ws'
import { challengeCheckMessage } from './challenge-check-message'
import { mainMenuInput } from './main-menu-input'
import { createMainMenu } from './mainmenu'
import { mountChallenge } from './new-challenge-service'
import { userAnswerInput } from './user-answer-input-service'
import { gameMetaData } from './game-meta-data'
import fliget from 'figlet'
const chalk = require('chalk')

const log = console.log

const clientEvents = {
  1: {
    event: 'client:game:mainmenu',
    userMenuOption: ''
  },
  2: {
    event: 'client:challenge:new'
  },
  3: {
    event: 'client:challenge:answer'
  },
  4: {
    event: 'client:challenge:check',
    currentQuestion: '',
    userAnswer: ''
  },
  5: {
    event: 'client:game:end',
    scoreboard: 0
  }
}

const clientA = new WebSocket('ws://localhost:3333/', {
  protocolVersion: 13
})

clientA.on('open', async function open () {
  clientA.send(JSON.stringify(clientEvents[1]))
})

clientA.on('message', async function message (data) {
  const fullChallenge = JSON.parse(data.toString())
  switch (fullChallenge.event) {
    case 'server:game:mainmenu':
      createMainMenu(fullChallenge.content.toString())
      const userMMInput = JSON.stringify(await mainMenuInput())
      switch (userMMInput) {
        case '0':
          clientA.send(JSON.stringify(clientEvents[2]))
          break
      }
      break
    case 'server:challenge:new':
      try {
        if (gameMetaData.getTurn() > 3) {
          clientA.send(JSON.stringify(clientEvents[5]))
          break
        }
        log('[TURN]: ', chalk.black.bgGreenBright(gameMetaData.getTurn()))
        log('[SCOREBOARD]: ', chalk.black.bgGreenBright(gameMetaData.getScoreboard()))
        // console.log('[BEFORE PARSE ON CLIENT]: ', fullChallenge.content.event)
        clientEvents[4].currentQuestion = JSON.parse(fullChallenge.content.event).id
        // console.log(`[TURN]: ${fullChallenge.gamemetadata.turn}/3`)
        // if (fullChallenge.gamemetadata.turn === 3) {
        //   clientA.send(JSON.stringify(clientEvents[5]))
        //   break
        // }
        mountChallenge(JSON.parse(fullChallenge.content.event))
        clientA.send(JSON.stringify(clientEvents[3]))
      } catch (error) {
        console.log('[ERROR][EVENT][server:challenge:new]')
        console.log(error)
      }
      break
    case 'server:challenge:answer':
      try {
        const message = 'CHOOSE AN OPTION ABOVE'
        const userInput = JSON.stringify(await userAnswerInput(message))
        // console.log('[USER INPUT]: ', userInput)
        clientEvents[4].userAnswer = userInput.replace(/"/g, '')
        // console.log('[EVENT BEFORE SEND]: ', clientEvents[4])
        gameMetaData.updateTurn()
        clientA.send(JSON.stringify(clientEvents[4]))
      } catch (error) {
        console.log('[ERROR][EVENT][server:challenge:answer]')
        console.log(error)
      }
      break
    case 'server:challenge:correct':
      gameMetaData.updateScoreboard()
      challengeCheckMessage(fullChallenge.content, true)
      clientA.send(JSON.stringify(clientEvents[2]))
      break
    case 'server:challenge:wrong':
      challengeCheckMessage(fullChallenge.content, false)
      clientA.send(JSON.stringify(clientEvents[2]))
      break
    case 'server:game:end':
      fliget('YOUR SCORE', {
        font: 'Standard',
        horizontalLayout: 'default',
        verticalLayout: 'default',
        whitespaceBreak: true
      }, function (err, data) {
        if (err != null) {
          console.log('OOPS, Something went wrong')
          console.dir(err)
        }
        log(chalk.black.bgYellowBright(data))
        log('[SCOREBOARD]: ', chalk.black.bgGreenBright(gameMetaData.getScoreboard()))
        log('[THANKS FOR PLAYING!]')
      })
      break
  }
})
