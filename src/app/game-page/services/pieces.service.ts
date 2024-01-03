import { Injectable } from '@angular/core';
import { GameResult, Piece } from '../models/board';

@Injectable({
  providedIn: 'root'
})
export class PiecesService {

  getOppositePiece(piece: Piece): Piece {
    return piece == Piece.Circle ? Piece.Cross : Piece.Circle;
  }

  mapFromNameToValue(piece: string): Piece {
    return piece == "\"Circle\"" ? Piece.Circle : Piece.Cross;
  }

  mapGameResult(gameResult: string): GameResult {
    switch (gameResult) {
      case "\"Circle\"": { return GameResult.Circle; }
      case "\"Cross\"": { return GameResult.Cross }
      case "\"Draw\"": { return GameResult.Draw }
      case "\"StillInGame\"": { return GameResult.StillInGame }
      default: return GameResult.Unfinished
    }
  }
}
