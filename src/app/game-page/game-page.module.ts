import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameBoardComponent } from './game-board/game-board.component';
import { BoardActivityDirective } from './directives/board-activity.directive';



@NgModule({
  declarations: [
    GameBoardComponent,
    BoardActivityDirective
  ],
  imports: [
    CommonModule
  ]
})
export class GamePageModule { }
