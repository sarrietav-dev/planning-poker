import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatVote',
})
export class FormatVotePipe implements PipeTransform {

  transform(value: number, ...args: unknown[]): unknown {
    if (value === 1) {
      return `${value} voto`
    } else {
      return `${value} votos`
    }
  }

}
