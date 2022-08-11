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
  },
  6: {
    event: 'server:game:mainmenu',
    content: gameMenu()
  },
  7: {
    event: 'server:game:end'
  }
}

interface Challenge {
  id: string
  question: string
  options: string[]
  correct: string
}

function gameMenu (): string[] {
  const options = ['start', 'end']
  return options.map((option, index) => {
    return `[${index}] - ${option}`
  })
}

function randomChallenge (challenges: Challenge[]): Challenge {
  const min = 1
  const max = challenges.length - 1
  let random = Math.floor(Math.random() * (max - min + 1) + 1)
  if (random > max) {
    random = Math.floor(Math.random() * (max - min + 1) + 1)
  }
  return challenges[random]
}

const PORT = 3333
const server = createServer()
const webSocketServer = new WebSocketServer({ server })

webSocketServer.on('connection', function connection (socket) {
  socket.on('message', function message (data: Buffer) {
    const eventFromClient: Event = JSON.parse(data.toString())
    switch (eventFromClient.event) {
      case 'client:game:mainmenu':
        socket.send(JSON.stringify(serverEvents[6]))
        break
      case 'client:challenge:new':
        newChallenge.event = JSON.stringify(randomChallenge(challenges))
        console.log('[SERVER]: ', newChallenge)
        socket.send(JSON.stringify(serverEvents[1]))
        break
      case 'client:challenge:answer':
        socket.send(JSON.stringify(serverEvents[2]))
        break
      case 'client:challenge:check':
        // console.log('[CHECK ANSWER]: ', eventFromClient.userAnswer)
        // console.log('[CHECK ANSWER]: ', parseInt(eventFromClient.userAnswer ?? ''))
        // serverEvents[4].gamemetadata.turn += 1
        if (!checkUserAnswer(parseInt(eventFromClient.userAnswer ?? ''), eventFromClient.currentQuestion ?? '')) {
          // serverEvents[4].gamemetadata.scoreboard += 1
          socket.send(JSON.stringify(serverEvents[4]))
          break
        }
        socket.send(JSON.stringify(serverEvents[5]))
        break
      case 'client:game:end':
        console.log('[IT WAS A GREAT MATCH, BUT IT ENDS]')
        // console.log('[YOUR POINTS]: ', eventFromClient.scoreboard)
        socket.send(JSON.stringify(serverEvents[7]))
        break
    }
  })
})

server.listen(PORT, () => console.log(`[SERVER UP AND RUNNING ON PORT ${PORT}]`))
