import { Directive, EventEmitter, HostListener, Input, Output } from '@angular/core';

@Directive({
  selector: '[appLongPress]'
})
export class LongPressDirective {
  // Delay in milliseconds (default 200ms)
  @Input() longPressDelay = 200;
  // Emit the event when the long press is triggered.
  @Output() longPress = new EventEmitter<MouseEvent>();

  private timer: any;

  @HostListener('mousedown', ['$event'])
  onMouseDown(event: MouseEvent): void {
    this.timer = setTimeout(() => {
      this.longPress.emit(event);
    }, this.longPressDelay);
  }

  @HostListener('mouseup')
  @HostListener('mouseleave')
  cancelLongPress(): void {
    clearTimeout(this.timer);
  }
}
