import { Injectable } from '@angular/core';
import { Piece } from '../models/board';

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
}
