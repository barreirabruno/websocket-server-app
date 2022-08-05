/* eslint-disable no-case-declarations */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-base-to-string */
import WebSocket from 'ws'
import { challengeCheckMessage } from './challenge-check-message'
import { mountChallenge } from './new-challenge-service'
import { userAnswerInput } from './user-answer-input-service'

const clientEvents = {
  1: {
    event: 'client:challenge:new',
    id: '1'
  },
  2: {
    event: 'client:challenge:answer',
    id: '2'
  },
  3: {
    event: 'client:challenge:check',
    currentQuestion: '',
    userAnswer: '',
    id: '3'
  }
}

const clientA = new WebSocket('ws://localhost:3333/', {
  protocolVersion: 13
})

clientA.on('open', function open () {
  console.log('[CLIENT A CONNECTED]')
  clientA.send(JSON.stringify(clientEvents[1]))
})

clientA.on('message', async function message (data) {
  const fullChallenge = JSON.parse(data.toString())
  switch (fullChallenge.event) {
    case 'server:challenge:new':
      clientEvents[3].currentQuestion = JSON.parse(fullChallenge.content.event).id
      mountChallenge(JSON.parse(fullChallenge.content.event))
      clientA.send(JSON.stringify(clientEvents[2]))
      break
    case 'server:challenge:answer':
      const userInput = JSON.stringify(await userAnswerInput())
      clientEvents[3].userAnswer = userInput
      clientA.send(JSON.stringify(clientEvents[3]))
      break
    case 'server:challenge:correct':
      challengeCheckMessage(fullChallenge.content, true)
      clientA.send(JSON.stringify(clientEvents[1]))
      break
    case 'server:challenge:wrong':
      challengeCheckMessage(fullChallenge.content, false)
      clientA.send(JSON.stringify(clientEvents[1]))
      break
  }
})
