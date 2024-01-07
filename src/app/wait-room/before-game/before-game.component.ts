import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs';
import { UserService } from '../../auth-page/utils/user.service';


@Component({
  selector: 'app-before-game',
  templateUrl: './before-game.component.html',
  styleUrls: ['./before-game.component.css'],
  
})
export class BeforeGameComponent implements OnInit {

  playerId: number;

  username: string;

  pageRanking = 1;

  sizeRanking = 10;

  pageHistory = 1;

  sizeHistory = 10;

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private userService: UserService) { }

  ngOnInit(): void {
    this.playerId = this.userService.playerId;
    this.username = this.userService.username;
  }

  startGame() {
    this.router.navigate(["/game"], { state: { playerId: this.playerId, username: this.username } });
  }
}
