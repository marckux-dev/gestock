import { Component } from '@angular/core';
import {MaterialModule} from '../../../../material/material/material.module';
import {RouterOutlet} from '@angular/router';

@Component({
  selector: 'auth-layout',
  imports: [
    MaterialModule,
    RouterOutlet
  ],
  templateUrl: './layout.component.html',
  standalone: true,
  styles: ``
})
export class LayoutComponent {

}
