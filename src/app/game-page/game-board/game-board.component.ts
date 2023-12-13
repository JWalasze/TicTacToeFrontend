import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { animate, group, state, style, transition, trigger } from '@angular/animations';
import { SignalRService } from '../services/hub.service';
import { TicTacToe, Piece, Tile } from '../models/board';
import { combineLatest, filter, map } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { PiecesService } from '../services/pieces.service';


@Component({
  selector: 'app-game-board',
  templateUrl: './game-board.component.html',
  styleUrls: ['./game-board.component.css'],
  animations: [
    //trigger('changeColor', [
    //  state('initial', style({
    //    backgroundColor: 'red'
    //  })),
    //  state('final', style({
    //    backgroundColor: 'green'
    //  })),
    //  transition('initial <=> final', animate('1000ms'))
    //])
  ]
})
export class GameBoardComponent implements OnInit, OnDestroy {

  playerId: number;
  playerUsername: string;
  playerPiece: Piece;

  opponentId: number;
  opponentUsername: string;
  opponentPiece: Piece;
  opponentConnectionId: string;

  groupName: string;

  game: TicTacToe = {
    board: [[Tile.Empty, Tile.Empty, Tile.Empty],
    [Tile.Empty, Tile.Empty, Tile.Empty],
    [Tile.Empty, Tile.Empty, Tile.Empty]]
  };

  waitForYourTurn = true;
  isBoardActive = false;

  tiles = {
    circle: Tile.Circle,
    cross: Tile.Cross,
    empty: Tile.Empty
  };

  colorState = 'initial';

  constructor(
    private signalRService: SignalRService,
    private activatedRoute: ActivatedRoute,
    private pieceService: PiecesService,
    private ref: ChangeDetectorRef,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.startGameSession();
  }

  ngOnDestroy(): void {
    this.endGameSession();
  }

  private startGameSession(): void {
    this.signalRService.startConnection().then(() => {

      combineLatest([this.signalRService.getGameGroupInfo(), this.getPlayerInfo()]).subscribe(([[opponentConnectionId, groupName], playerInfo]) => {
        this.playerId = playerInfo.playerId;
        this.playerUsername = playerInfo.username;

        this.opponentConnectionId = opponentConnectionId;
        this.groupName = groupName;

        console.log("Player id: " + this.playerId);
        console.log("Player username: " + this.playerUsername);

        console.log("Opponent connection ID:" + opponentConnectionId);
        console.log("Group name: " + groupName);

        this.sendDataToOpponent();
      });

      this.getAssignedPieces();
      this.getOpponentData();

      combineLatest([this.signalRService.getAssignedPiece(), this.signalRService.getOpponentData()]).subscribe(() => {
        this.signalRService.sendPlayerReadiness(this.opponentConnectionId, this.groupName);
      });

      this.observeStartOfGame();
      this.observeChangingBoard();
      this.observeEndOfGame();
    });
  }

  private getPlayerInfo() {
    return this.activatedRoute.paramMap
      .pipe(map(() => window.history.state));
  }

  private endGameSession(): void {
    this.signalRService.endConnection();
  }

  private getAssignedPieces(): void {
    this.signalRService.getAssignedPiece().subscribe(piece => {
      this.playerPiece = this.pieceService.mapFromNameToValue(piece);
      this.opponentPiece = this.pieceService.getOppositePiece(this.playerPiece);

      console.log("Player: " + this.playerPiece);
      console.log("Opponent: " + this.opponentPiece);
    });
  }

  private getOpponentData(): void {
    this.signalRService.getOpponentData().subscribe(([opponentId, opponentUsername]) => {
      this.opponentId = opponentId;
      this.opponentUsername = opponentUsername;

      console.log("Opponent id: " + this.opponentId);
      console.log("Opponent username: " + this.opponentUsername);
    });
  }

  private sendDataToOpponent(): void {
    this.signalRService.sendPlayerDataToOpponent(this.playerId, this.playerUsername, this.opponentConnectionId);
  }

  private observeChangingBoard(): void {
    this.signalRService.observeChangingBoard()
      .pipe(
        filter(([, whoseTurn,]) => {
          if (whoseTurn == null) {
            return true;
          }
          return this.pieceService.mapFromNameToValue(whoseTurn) != this.pieceService.getOppositePiece(this.playerPiece);
        }),)
        //map(([board,,]) => board))
      .subscribe(([board, whoseTurn, whoHasWon]) => {
        if (whoseTurn == null) {
          console.log("Mamy koniec gry");
          console.log("No i pa na to: " + whoseTurn + ", i pa na to: " + whoHasWon);
          this.game = board;
          this.waitForYourTurn = true;
          this.isBoardActive = false;

          if (whoHasWon == null) {
            console.log("Mamy draw");
            return;
          }
          console.log("Nie mamy draw ale zwyciezce");
          return;
        }

        this.game = board;
        this.waitForYourTurn = false;
        this.isBoardActive = true;
        this.ref.detectChanges();
      });
  }

  private observeStartOfGame(): void {
    this.signalRService.observeStartOfTheGame().subscribe((message) => {
      this.waitForYourTurn = this.playerPiece == Piece.Circle ? false : true;
      this.isBoardActive = this.playerPiece == Piece.Circle ? true : false;

      console.log(message);
    });
  }

  private observeEndOfGame(): void {
    this.signalRService.observeGameEnd().subscribe((whoHasWon) => {
      if (whoHasWon == null) {
        console.log("It's a draw");
      }

      console.log("The winner is: " + whoHasWon);
    });
  }

  onMoveClick(row: number, col: number): void {
    if (this.game.board[row][col] == Tile.Empty) {
      this.updateLocalBoard(row, col);
      this.signalRService.updateBoard(this.game, this.playerPiece, this.groupName);
    }
  }

  private updateLocalBoard(row: number, col: number): void {
    this.waitForYourTurn = true;
    this.isBoardActive = false;
    this.game.board[row][col] = this.playerPiece == Piece.Circle ? Tile.Circle : Tile.Cross;
  }

  colorIfTaken(row: number, col: number) {
    if (this.game.board[row][col] != Tile.Empty) {
      return '#f2f2f2';
    }

    return '';
  }

  checkIfTileIsActive(row: number, col: number): boolean {
    return this.isBoardActive && this.game.board[row][col] == Tile.Empty
  }

  exitGame(): void {
    this.router.navigate(['/wait_room']);
  }

  toggleColor() {
    this.colorState = (this.colorState === 'initial') ? 'final' : 'initial';
  }

  private getCurrentConnectionState(): void {
    console.log(this.signalRService.getConnectionState());
  }
}
