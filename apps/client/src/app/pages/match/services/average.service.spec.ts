import { TestBed } from '@angular/core/testing';

import { AverageService } from './average.service';

describe('AverageService', () => {
  let service: AverageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AverageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('calculateAverage', () => {
    it('should return "0.0" when results array is empty', () => {
      const results: Parameters<typeof service.calculateAverage>[0] = [];
      expect(service.calculateAverage(results)).toEqual("0.0");
    });

    it('should return the correct average when results array has one item', () => {
      const results = [{ card: 5, votes: 1 }];
      expect(service.calculateAverage(results)).toEqual("5.0");
    });

    it('should return the correct average when results array has multiple items', () => {
      const results = [
        { card: 5, votes: 1 },
        { card: 3, votes: 2 },
        { card: 4, votes: 3 },
      ];
      expect(service.calculateAverage(results)).toEqual("3.8");
    });

    it('should return the correct average when votes are not equal', () => {
      const results = [
        { card: 5, votes: 2 },
        { card: 3, votes: 3 },
        { card: 4, votes: 1 },
      ];
      expect(service.calculateAverage(results)).toEqual("3.8");
    });
  });
});
