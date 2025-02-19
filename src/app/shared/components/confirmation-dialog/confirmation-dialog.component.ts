import {Component, Inject} from '@angular/core';
import {MaterialModule} from '../../../material/material/material.module';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'shared-confirmation-dialog',
  imports: [MaterialModule],
  templateUrl: './confirmation-dialog.component.html',
  standalone: true,
  styles: ``
})
export class ConfirmationDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<ConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { title: string, question: string }
  ) {}

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }



}
