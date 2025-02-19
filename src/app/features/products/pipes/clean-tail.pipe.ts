import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  standalone: true,
  name: 'cleanTail'
})
export class CleanTailPipe implements PipeTransform {

  transform(value: string): string {
    return value.replace(/d:[0-9]+$/, '[DESCATALOGADO]');
  }

}
