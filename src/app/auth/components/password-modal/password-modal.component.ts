import {Component, Inject} from '@angular/core';
import {MaterialModule} from '../../../material/material/material.module';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';


@Component({
  selector: 'auth-password-modal',
  imports: [MaterialModule],
  templateUrl: './password-modal.component.html',
  standalone: true
})
export class PasswordModalComponent {

  constructor(
    public dialogRef: MatDialogRef<PasswordModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { password: string }
  ) {}

  onClose(): void {
    this.dialogRef.close();
  }
}
