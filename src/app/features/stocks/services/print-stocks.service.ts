import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import QRCode from 'qrcode';
import {Stock} from '../interfaces/stock.interface';

@Injectable({
  providedIn: 'root'
})
export class PrintStocksService {

  /**
   * Generates a PDF where each stock is rendered in a box with its name, maximum storage, and a QR code for the stock id.
   * @param stocks An array of Stock objects.
   * @param printDirectly If true, the PDF is opened in a new window and triggers the print dialog; otherwise it is downloaded.
   */
  public async printStocks(stocks: Stock[], printDirectly: boolean = false): Promise<void> {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Box configuration
    const boxX = 10;                       // left margin for the box
    const boxWidth = pageWidth - 20;         // leave 10 mm margin on each side
    const boxHeight = 50;                    // fixed box height
    const verticalMargin = 10;               // space between boxes
    let currentY = 10;                       // starting vertical position

    for (const stock of stocks) {
      // Check if the current box will overflow the page; if so, add a new page.
      if (currentY + boxHeight + verticalMargin > pageHeight) {
        doc.addPage();
        currentY = 10;
      }

      // Draw a rectangle as the box
      doc.rect(boxX, currentY, boxWidth, boxHeight);

      // Add text inside the box (with a small left padding)
      const textX = boxX + 5;
      const textY = currentY + 15;
      doc.text(`Name: ${stock.product.short_name}`, textX, textY);
      doc.text(`Max: ${stock.maximum_storage}`, textX, textY + 10);

      // Generate the QR code image from the stock id.
      // Here we use the library to generate a data URL; the width option is not the final display size.
      const qrSize = 30;
      const qrDataUrl = await QRCode.toDataURL(stock.id, { width: 100 });

      // Position the QR code on the right side of the box (with 5 mm right margin)
      const qrX = boxX + boxWidth - qrSize - 5;
      const qrY = currentY + (boxHeight - qrSize) / 2;
      doc.addImage(qrDataUrl, 'PNG', qrX, qrY, qrSize, qrSize);

      // Increment the Y position for the next box.
      currentY += boxHeight + verticalMargin;
    }

    // If printDirectly is true, open the PDF in a new window and trigger printing.
    if (printDirectly) {
      const pdfDataUrl = doc.output('dataurlstring');
      const printWindow = window.open(pdfDataUrl);
      if (printWindow) {
        printWindow.addEventListener('load', () => {
          printWindow.print();
        });
      }
    } else {
      // Otherwise, download the PDF.
      doc.save('stocks.pdf');
    }
  }
}

