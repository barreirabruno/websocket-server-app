/* eslint-disable @typescript-eslint/no-base-to-string */
import { createServer } from 'http'
import Buffer, { WebSocketServer } from 'ws'
import { challenges } from './challenges'
import { checkUserAnswer } from './check-user-answer-service'
// import { checkUserAnswer } from './check-user-answer-service'

interface Event {
  event: string
  currentQuestion?: string
  userAnswer?: string
  id: string
}

// const chall = randomChallenge(challenges)

const newChallenge: Event = {
  event: JSON.stringify(randomChallenge(challenges)),
  id: 'any_event_id_here'
}

const serverEvents = {
  1: {
    event: 'server:challenge:new',
    content: newChallenge,
    id: '1'
  },
  2: {
    event: 'server:challenge:answer',
    content: null,
    id: '2'
  },
  3: {
    event: 'server:challenge:answer',
    content: null,
    id: '3'
  },
  4: {
    event: 'server:challenge:wrong',
    content: ' *** WRONG, KEEP PLAYING *** ',
    id: '4'
  },
  5: {
    event: 'server:challenge:correct',
    content: ' *** CORRECT, KEEP PLAYING *** ',
    id: '5'
  }
}

interface Challenge {
  id: string
  question: string
  options: string[]
  correct: string
}

function randomChallenge (challenges: Challenge[]): Challenge {
  const min = 1
  const max = challenges.length
  const random = Math.floor(Math.random() * (max - min + 1) + 1)
  return challenges[random]
}

const PORT = 3333
const server = createServer()
const webSocketServer = new WebSocketServer({ server })

webSocketServer.on('connection', function connection (socket) {
  socket.on('message', function message (data: Buffer) {
    const eventFromClient: Event = JSON.parse(data.toString())
    switch (eventFromClient.event) {
      case 'client:challenge:new':
        newChallenge.event = JSON.stringify(randomChallenge(challenges))
        socket.send(JSON.stringify(serverEvents[1]))
        break
      case 'client:challenge:answer':
        socket.send(JSON.stringify(serverEvents[2]))
        break
      case 'client:challenge:check':
        // console.log('[CHECK USER ANSWER]')
        // console.log('[FROM CLIENT]: ', eventFromClient)
        if (!checkUserAnswer(parseInt(eventFromClient.userAnswer ?? ''), eventFromClient.currentQuestion ?? '')) {
          socket.send(JSON.stringify(serverEvents[4]))
          break
        }
        socket.send(JSON.stringify(serverEvents[5]))
        break
    }
  })
})

server.listen(PORT, () => console.log(`[SERVER UP AND RUNNING ON PORT ${PORT}]`))
