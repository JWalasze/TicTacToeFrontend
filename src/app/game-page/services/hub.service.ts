
import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder, HubConnectionState } from '@microsoft/signalr';
import { TicTacToe, Piece } from '../models/board';
import { environment } from '../../../environment';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root',
  //useFactory: () => new SignalRService()
})
export class SignalRService {
  private hubConnection: HubConnection;

  constructor() {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(environment.hubUrl)
      .build();
  }

  startConnection(): Promise<void> {
    return this.hubConnection.start();
  }

  endConnection(): void {
    this.hubConnection
      .stop()
      .then(() => {
        console.log('Connection has been ended!');
      }).catch((err) => {
        console.error("Couldn't end session: " + this.hubConnection.connectionId + ": " + err.toString())
      });
  }

  getAssignedPiece(): Observable<string> {
    return new Observable<string>((observer) => {
      this.hubConnection.on("AssignPiece", (piece: string) => {
        console.log("Tell me co sie kurwa dzieje");
        observer.next(piece);
        observer.complete();
      });
    });
  }

  getGameGroupInfo(): Observable<[string, string]> {
    return new Observable<[string, string]>((observer) => {
      console.log("WHATEVER IT TAKES");
      this.hubConnection.on("WhoIsMyOpponent", (opponentConnId: string, groupName: string) => {
        console.log("Am I draming again?");
        observer.next([opponentConnId, groupName]);
        observer.complete();
      });
    });
  }

  getOpponentData(): Observable<[number, string]> {
    return new Observable<[number, string]>((observer) => {
      this.hubConnection.on("ReceiveOpponentDetails", (opponentId: number, opponentUsername: string) => {
        console.log("It's getting more dreamy");
        observer.next([opponentId, opponentUsername]);
        observer.complete();
        console.log("HOW KURWA");
      });
    });
  }

  //Później się zastanwoić czy te pojedyncze metody nie lepiej wysylac restowo
  sendPlayerDataToOpponent(playerId: number, playerUsername: string, opponentConnectionId: string): void {
    console.log("Co jest to się nie wysyła???");
    this.hubConnection.invoke("SendDataToOpponent", playerId, playerUsername, opponentConnectionId)
      .then(() => {
        console.log("Data has been sent successfully.");
      })
      .catch((err) => {
        console.error("Error while sending data to the opponent: " + err.toString())
      });
  }

  sendPlayerReadiness(opponentConnectionId: string, groupName: string): void {
    this.hubConnection.invoke("SendPlayerReadiness", opponentConnectionId, groupName)
      .then(() => {
        console.log("Info has been sent successfully.");
      })
      .catch((err) => {
        console.error("Error while sending info on the server: " + err.toString())
      });
  }

  observeStartOfTheGame(): Observable<string> {
    return new Observable<string>((observer) => {
      console.log("Fucking assholes");
      this.hubConnection.on("StartGame", (message: string) => {
        observer.next(message);
        observer.complete();
      });
    });
  }
  
  updateBoard(board: TicTacToe, whoMadeMove: Piece, groupName: string, opponentConnectionId: string) {
    const boardStr = JSON.stringify(board);
    const whoMadeMoveStr = JSON.stringify(whoMadeMove);

    this.hubConnection.invoke("UpdateBoardAfterMove", boardStr, whoMadeMoveStr, groupName, opponentConnectionId).then(() => {
      console.log("Method " + "'UpdateBoardAfterMove'" + " was sucessfully invoked!");
    }).catch((err) => {
      console.error("We have an error in invokement of the server method: " + err.toString());
    });
  }
  
  observeChangingBoard(): Observable<[TicTacToe, string, string]> {
    return new Observable<[TicTacToe, string, string]>((observer) => {
      console.log("I am scared to check here");
      this.hubConnection.on("MadeMove", (board: string, nextMove: string, whoHasWon: string) => {
        const boardObj = JSON.parse(board) as TicTacToe;
        observer.next([boardObj, nextMove, whoHasWon]);
      });
    });
  }

  getConnectionState(): HubConnectionState {
    return this.hubConnection.state;
  }
}
