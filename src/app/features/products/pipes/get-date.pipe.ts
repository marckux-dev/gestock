import { Pipe, PipeTransform} from '@angular/core';

@Pipe({
  standalone: true,
  name: 'getDate'
})
export class GetDatePipe implements PipeTransform {

  transform(value: string): string {
    const match = value.match(/d:(\d+)$/);
    if (match) {
      const timestamp =parseInt(match[1], 10);
      return new Date(timestamp).toDateString();
    }
    return value;
  }
}
