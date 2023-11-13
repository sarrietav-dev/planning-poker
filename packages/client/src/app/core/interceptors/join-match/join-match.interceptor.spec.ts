import { TestBed } from '@angular/core/testing';

import { JoinMatchInterceptor } from './join-match.interceptor';

describe('JoinMatchInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      JoinMatchInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: JoinMatchInterceptor = TestBed.inject(JoinMatchInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
