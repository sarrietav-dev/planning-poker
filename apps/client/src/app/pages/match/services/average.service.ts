import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AverageService {
  calculateAverage(results: { card: number; votes: number }[]): string {
    if (!results.length) {
      return "0.0";
    }

    return (
      results.reduce((acc, curr) => {
        return acc + curr.card * curr.votes;
      }, 0) / results.reduce((acc, curr) => acc + curr.votes, 0)
    ).toFixed(1);
  }
}
