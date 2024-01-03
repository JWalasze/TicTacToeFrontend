import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { animate, group, state, style, transition, trigger } from '@angular/animations';
import { SignalRService } from '../services/hub.service';
import { TicTacToe, Piece, Tile, GameResult } from '../models/board';
import { Subscription, combineLatest, filter, map } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { PiecesService } from '../services/pieces.service';
import { LoaderService } from '../services/loader.service';


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

  gameStatus = GameResult.StillInGame;

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

  buttonLabel = 'I would like to give up!';

  subscriptions = new Subscription();

  constructor(
    private signalRService: SignalRService,
    private activatedRoute: ActivatedRoute,
    private pieceService: PiecesService,
    private ref: ChangeDetectorRef,
    private router: Router,
    private loader: LoaderService
  ) { }

  ngOnInit(): void {
    this.loader.enableLoadingWithMessage("Looking for a player . . .");
    this.startGameSession();
  }

  ngOnDestroy(): void {
    this.endGameSession();
    this.loader.disableLoading();
  }

  private startGameSession(): void {
    this.signalRService.startConnection().then(() => {

      const sub1 = combineLatest([this.signalRService.getGameGroupInfo(), this.getPlayerInfo()]).subscribe(([[opponentConnectionId, groupName], playerInfo]) => {
        this.playerId = playerInfo.playerId;
        this.playerUsername = playerInfo.username;

        this.opponentConnectionId = opponentConnectionId;
        this.groupName = groupName;

        this.loader.setMessage("Wait for player to be ready . . .");

        console.log("Player id: " + this.playerId);
        console.log("Player username: " + this.playerUsername);

        console.log("Opponent connection ID:" + opponentConnectionId);
        console.log("Group name: " + groupName);

        this.sendDataToOpponent();
      });
      this.subscriptions.add(sub1);

      this.getAssignedPieces();
      this.getOpponentData();

      const sub2 = combineLatest([this.signalRService.getAssignedPiece(), this.signalRService.getOpponentData()]).subscribe(() => {
        this.signalRService.sendPlayerReadiness(this.opponentConnectionId, this.groupName);
      });
      this.subscriptions.add(sub2);

      this.observeStartOfGame();
      this.observeChangingBoard();
    });
  }

  private getPlayerInfo() {
    console.log("JESLI KURWA TEGO NIE WIDZE...");
    return this.activatedRoute.paramMap
      .pipe(map(() => window.history.state));
  }

  private endGameSession(): void {
    this.subscriptions.unsubscribe();
    this.signalRService.endConnection();
  }

  private getAssignedPieces(): void {
    const sub = this.signalRService.getAssignedPiece().subscribe(piece => {
      this.playerPiece = this.pieceService.mapFromNameToValue(piece);
      this.opponentPiece = this.pieceService.getOppositePiece(this.playerPiece);

      console.log("Player: " + this.playerPiece);
      console.log("Opponent: " + this.opponentPiece);
    });
    this.subscriptions.add(sub);
  }

  private getOpponentData(): void {
    const sub = this.signalRService.getOpponentData().subscribe(([opponentId, opponentUsername]) => {
      this.opponentId = opponentId;
      this.opponentUsername = opponentUsername;

      console.log("Opponent id: " + this.opponentId);
      console.log("Opponent username: " + this.opponentUsername);
    });
    this.subscriptions.add(sub);
  }

  private sendDataToOpponent(): void {
    this.signalRService.sendPlayerDataToOpponent(this.playerId, this.playerUsername, this.opponentConnectionId);
  }

  private observeChangingBoard(): void {
    const sub = this.signalRService.observeChangingBoard()
      .pipe(
        filter(([, whoseTurn,]) => {
          if (whoseTurn == null) {
            return true;
          }
          return this.pieceService.mapFromNameToValue(whoseTurn) == this.playerPiece;
        }))
      .subscribe(([board, whoseTurn, whoHasWon]) => {
        if (whoseTurn == null) {
          
          this.game = board;
          this.waitForYourTurn = true;
          this.isBoardActive = false;

          const gameResult = this.pieceService.mapGameResult(whoHasWon);
          this.gameStatus = gameResult;

          this.buttonLabel = 'Return to lobby';

          if (gameResult == GameResult.Draw) {
            console.log("Mamy draw");
            return;
          }
          
          if (gameResult == GameResult.Circle) {
            console.log("Kolko wygralo");
            return;
          }

          if (gameResult == GameResult.Cross) {
            console.log("Krzyzyk wygralo");
            return;
          }

          return;
        }

        this.game = board;
        this.waitForYourTurn = false;
        this.isBoardActive = true;
      });
    this.subscriptions.add(sub);
  }

  private observeStartOfGame(): void {
    const sub = this.signalRService.observeStartOfTheGame().subscribe((message) => {
      this.waitForYourTurn = this.playerPiece == Piece.Circle ? false : true;
      this.isBoardActive = this.playerPiece == Piece.Circle ? true : false;
      this.loader.disableLoading();
      console.log(message);
    });
    this.subscriptions.add(sub);
  }

  onMoveClick(row: number, col: number): void {
    if (this.game.board[row][col] == Tile.Empty) {
      this.updateLocalBoard(row, col);
      this.signalRService.updateBoard(this.game, this.playerPiece, this.groupName, this.opponentConnectionId);
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
    this.router.navigate(['/wait_room'], { state: { playerId: this.playerId, username: this.playerUsername } });
  }

  toggleColor() {
    this.colorState = (this.colorState === 'initial') ? 'final' : 'initial';
  }

  private getCurrentConnectionState(): void {
    console.log(this.signalRService.getConnectionState());
  }
}
