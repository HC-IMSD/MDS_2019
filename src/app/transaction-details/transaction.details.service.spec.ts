import { TestBed, inject } from '@angular/core/testing';

import { TransactionDetailsService } from './transaction.details.service';

describe('TransactionDetailsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TransactionDetailsService]
    });
  });

  it('should be created', inject([TransactionDetailsService], (service: TransactionDetailsService) => {
    expect(service).toBeTruthy();
  }));
});
