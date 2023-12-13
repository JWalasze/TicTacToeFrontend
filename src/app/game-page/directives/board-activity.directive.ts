import { Directive, HostBinding, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appBoardActivity]'
})
export class BoardActivityDirective {

  @Input() set tileStatus(value: boolean) {
    this.areTilesActive = !value;
  }

  @HostBinding('class.no-hover') areTilesActive = false;

  //@HostListener('mouseenter') onMouseEnter() {
    
  //}

  //@HostListener('mouseleave') onMouseLeave() {
   
  //}

}
