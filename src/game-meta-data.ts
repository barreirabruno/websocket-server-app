class GameMetaData {
  turn: number
  scoreBoard: number

  constructor () {
    this.turn = 1
    this.scoreBoard = 0
  }

  public updateTurn (): void {
    this.turn += 1
  }

  public updateScoreboard (): void {
    this.scoreBoard += 1
  }

  public getTurn (): number {
    return this.turn
  }

  public getScoreboard (): number {
    return this.scoreBoard
  }
}

const gameMetaData = new GameMetaData()
export { gameMetaData }
