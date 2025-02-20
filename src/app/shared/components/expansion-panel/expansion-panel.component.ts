import {Component, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MaterialModule} from '../../../material/material/material.module';

@Component({
  selector: 'shared-expansion-panel',
  imports: [
    CommonModule,
    MaterialModule,
  ],
  templateUrl: './expansion-panel.component.html',
  standalone: true,
  styles: ``
})
export class ExpansionPanelComponent  {
  @Input() title: string = '';
  @Input() expanded: boolean = false;
  @Output() toggleChange = new EventEmitter<boolean>();

  onOpened(): void {
    this.expanded = true;
    this.toggleChange.emit(true);
  }

  onClosed(): void {
    this.expanded = false;
    this.toggleChange.emit(false);
  }


}
