import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameBoardComponent } from './game-board/game-board.component';
import { BoardActivityDirective } from './directives/board-activity.directive';
import { SpinnerComponent } from './spinner/spinner.component';



@NgModule({
  declarations: [
    GameBoardComponent,
    BoardActivityDirective,
    SpinnerComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    SpinnerComponent
  ]
})
export class GamePageModule { }
