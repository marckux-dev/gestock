import {Directive, ElementRef, HostListener, Input} from '@angular/core';

@Directive({
  selector: '[sharedBlurOnKeys]'
})
export class BlurOnKeysDirective {

  @Input('sharedBlurOnKeys')
  keys: string[] = ['Enter', 'Tab']


  constructor(
    private element: ElementRef<HTMLInputElement>
  ) {}

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if (this.keys.includes(event.key)) {
      this.element.nativeElement.blur();
      event.preventDefault();
    }
  }
}
