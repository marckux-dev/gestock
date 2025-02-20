import { Directive, EventEmitter, HostListener, Input, Output } from '@angular/core';

@Directive({
  selector: '[appLongPress]'
})
export class LongPressDirective {
  // Delay in milliseconds (default 200ms)
  @Input() longPressDelay = 200;
  // Emit the event when the long press is triggered.
  @Output() longPress = new EventEmitter<Event>();

  private timer: any;
  private startX: number = 0;
  private startY: number = 0;
  private tresshold: number = 10; // px

  // For desktop mouse events
  @HostListener('mousedown', ['$event'])
  onMouseDown(event: MouseEvent): void {
    this.startTimer(event);
  }

  @HostListener('mouseup')
  @HostListener('mouseleave')
  cancelLongPress(): void {
    this.clearTimer();
  }

  // For mobile touch events
  @HostListener('touchstart', ['$event'])
  onTouchStart(event: TouchEvent): void {
    const touch = event.touches[0];
    this.startX = touch.clientX;
    this.startY = touch.clientY;
    this.startTimer(event);
  }

  @HostListener('touchmove', ['$event'])
  onTouchMove(event: TouchEvent): void {
    const touch = event.touches[0];
    const deltaX = Math.abs(this.startX - touch.clientX);
    const deltaY = Math.abs(this.startY - touch.clientY);
    if (deltaX > this.tresshold || deltaY > this.tresshold) {
      this.clearTimer();
    }
  }

  @HostListener('touchend')
  @HostListener('touchcancel')
  onTouchEnd(): void {
    this.clearTimer();
  }

  private startTimer(event: Event): void {
    this.timer = setTimeout(() => {
      this.longPress.emit(event);
    }, this.longPressDelay);
  }

  private clearTimer(): void {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }
}

