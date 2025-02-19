import {Component, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MaterialModule} from '../../../material/material/material.module';
import {MatExpansionPanel} from '@angular/material/expansion';

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

  @ViewChild('me') expansionPanel!: MatExpansionPanel;

  toggle(): void {
    this.expanded = !this.expanded;
    this.toggleChange.emit(this.expanded);
  }


}
