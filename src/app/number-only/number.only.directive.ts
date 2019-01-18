/* tslint:disable:member-ordering */
import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[only-digits]'
})
export class NumbersOnlyDirective {

  private regex: RegExp = new RegExp(/[0-9]/g);
  // Allow key codes for special events. Reflect :
  private specialKeys: Array<number> = [46, 8, 9, 27, 13, 110, 190, 35, 36, 37, 39];
  // Backspace, tab, end, home

  @Input() maxlength: number;
  @Input() min: number;
  @Input() max: number;

  constructor(private el: ElementRef) {
  }
  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    let e = <KeyboardEvent>event;

    if ((
        (this.specialKeys.indexOf(event.which) > -1) ||
        // to allow backspace, enter, escape, arrows
        (e.which === 65 && e.ctrlKey === true) ||
        // Allow: Ctrl+C
        (e.which === 67 && e.ctrlKey === true) ||
        // Allow: Ctrl+X
        (e.which === 88 && e.ctrlKey === true))) {
      return;
    } else if (// to allow numbers
    (e.which >= 48 && e.which <= 57) ||
    // to allow numpad number
    (event.which >= 96 && event.which <= 105)) {
    } else {
      event.preventDefault();
    }
    let current: string = this.el.nativeElement.value;

    let next: string = current.concat(event.key);
    if ((next && !String(next).match(this.regex)) ||
      (this.maxlength && next.length > this.maxlength) ||
      (this.min && +next < this.min) ||
      (this.max && +next >= this.max)) {
      event.preventDefault();
    }

  }
}
