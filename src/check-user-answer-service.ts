import { challenges } from './challenges'

export const checkUserAnswer = (userInput: number, challengeIdParam: string): boolean => {
  const challengeIdFromDB = challenges.find(challenge => challenge.id === challengeIdParam)
  if (challengeIdFromDB?.correct !== challengeIdFromDB?.options[userInput]) {
    return false
  }
  return true
}
