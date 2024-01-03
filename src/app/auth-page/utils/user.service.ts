import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  _playerId: number;

  _username: string;

  _isUserAuthenticated = false;

  get isUserAuthenticated(): boolean {
    return this._isUserAuthenticated;
  }

  private set isUserAuthenticated(value: boolean) {
    this._isUserAuthenticated = value;
  }

  get playerId(): number {
    return this._playerId;
  }

  private set playerId(value: number) {
    this._playerId = value;
  }

  get username(): string {
    return this._username;
  }

  private set username(value: string) {
    this._username = value;
  }

  authenticateUser(playerId: number, username: string): void {
    this.playerId = playerId;
    this.username = username;
    this.isUserAuthenticated = true;
  }

}
