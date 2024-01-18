import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatCardValue',
})
export class FormatCardValuePipe implements PipeTransform {

  transform(value: number | undefined | null, ..._args: unknown[]): string {
    if (value) {
      return value.toString();
    }
    return '';
  }

}
