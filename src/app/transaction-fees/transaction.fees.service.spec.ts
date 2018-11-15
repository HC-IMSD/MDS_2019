import { TestBed, inject } from '@angular/core/testing';

import { TransactionFeesService } from './transaction.fees.service';

describe('TransactionFeesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TransactionFeesService]
    });
  });

  it('should be created', inject([TransactionFeesService], (service: TransactionFeesService) => {
    expect(service).toBeTruthy();
  }));
});
