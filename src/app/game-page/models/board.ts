export interface TicTacToe {
  board: Tile[][];
}

export enum Tile {
  Cross = 'CROSS',
  Circle = 'CIRCLE',
  Empty = 'EMPTY'
}

export enum Piece {
  Cross = 'CROSS',
  Circle = 'CIRCLE'
}

export enum GameResult {
  Circle = 'CIRCLE',
  Cross = 'CROSS',
  Draw = 'DRAW',
  Unfinished = 'UNFINISHED',
  StillInGame = 'STILL_IN_GAME'
}
