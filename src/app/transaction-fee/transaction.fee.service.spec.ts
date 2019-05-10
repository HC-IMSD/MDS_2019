import { TestBed, inject } from '@angular/core/testing';

import { TransactionFeeService } from './transaction.fee.service';

describe('TransactionFeeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TransactionFeeService]
    });
  });

  it('should be created', inject([TransactionFeeService], (service: TransactionFeeService) => {
    expect(service).toBeTruthy();
  }));
});
