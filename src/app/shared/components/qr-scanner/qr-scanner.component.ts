import {Component, inject} from '@angular/core';
import {MaterialModule} from '../../../material/material/material.module';
import {MatDialogRef} from '@angular/material/dialog';
import {ZXingScannerModule} from '@zxing/ngx-scanner';
import {BarcodeFormat} from '@zxing/library';

@Component({
  selector: 'shared-qr-scanner',
  imports: [MaterialModule, ZXingScannerModule],
  templateUrl: './qr-scanner.component.html',
  styles: ``
})
export class QrScannerComponent {

  private dialogRef = inject(MatDialogRef<QrScannerComponent>)

  allowedFormats: BarcodeFormat[] = [BarcodeFormat.QR_CODE];

  onCodeResult(resultString: string): void {
    this.dialogRef.close(resultString);
  }

  onClose(): void {
    this.dialogRef.close();
  }

}
