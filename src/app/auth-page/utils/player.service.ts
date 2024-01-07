import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {

  constructor(private http: HttpClient) { }

  addNewPlayer(username: string, password: string): Observable<number> {
    return this.http.post<number>(environment.apiUrl + environment.apiEndpoints.addNewPlayer, {
      username: username,
      password: password
    });
  }

  getPlayerIdByUsername(username: string): Observable<number> {
    return this.http.get<number>(environment.apiUrl + environment.apiEndpoints.getPlayerIdByUsername
      + "?username=" + username)
  }
}
