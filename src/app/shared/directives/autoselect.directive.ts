import {Directive, ElementRef, HostListener} from '@angular/core';

@Directive({
  selector: '[sharedAutoselect]'
})
export class AutoselectDirective {

  constructor(
    private element: ElementRef<HTMLInputElement>
  ) {}

  @HostListener('focus')
  onFocus(): void {
    setTimeout(() => this.element.nativeElement.select());
  }

}
