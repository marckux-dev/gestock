import {Component, inject, OnInit} from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  standalone: true,
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'stock-manager';

}
