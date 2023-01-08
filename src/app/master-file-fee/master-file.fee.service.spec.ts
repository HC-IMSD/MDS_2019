import { TestBed, inject } from '@angular/core/testing';

import { MasterFileFeeService } from './master-file.fee.service';

describe('MasterFileFeeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MasterFileFeeService]
    });
  });

  it('should be created', inject([MasterFileFeeService], (service: MasterFileFeeService) => {
    expect(service).toBeTruthy();
  }));
});
