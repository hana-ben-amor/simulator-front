import { TestBed } from '@angular/core/testing';

import { OptimizeService } from './optimize.service';

describe('OptimizeService', () => {
  let service: OptimizeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OptimizeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
