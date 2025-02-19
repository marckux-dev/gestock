import { Pipe, PipeTransform } from '@angular/core';
import {normalizeString} from '../helpers/strings.helpers';

@Pipe({
  standalone: true,
  name: 'sortStrings'
})
export class SortStringsPipe implements PipeTransform {

  transform(value: string[]): string[] {
    return [...value].sort(
      (a,b) =>
        normalizeString(a) > normalizeString(b)? 1: -1
    )
  }
}
