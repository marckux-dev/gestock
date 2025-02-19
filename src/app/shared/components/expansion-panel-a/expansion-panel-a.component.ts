import {Component, Input} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MaterialModule} from '../../../material/material/material.module';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'shared-expansion-panel-a',
  imports: [CommonModule, MaterialModule, RouterLink],
  templateUrl: './expansion-panel-a.component.html',
  standalone: true,
  styles: ``
})
export class ExpansionPanelAComponent {
  @Input()
  routerLink?: string | any[];

}
