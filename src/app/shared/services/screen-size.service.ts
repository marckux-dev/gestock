import {computed, Injectable, signal} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ScreenSizeService {
  private screenWidth = signal(window.innerWidth);

  isMobile = computed(() => this.screenWidth() < 768);
  isTablet = computed(() => this.screenWidth() >= 768 && this.screenWidth() < 992);
  isDesktop = computed(() => this.screenWidth() >= 992);

  constructor() {
    window.addEventListener('resize', () => {
      this.screenWidth.set(window.innerWidth);
    })
  }
}
