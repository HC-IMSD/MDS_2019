import { TestBed, inject } from '@angular/core/testing';

import { LicenceRecordService } from './licence-record.service';

describe('LicenceRecordService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LicenceRecordService]
    });
  });

  it('should be created', inject([LicenceRecordService], (service: LicenceRecordService) => {
    expect(service).toBeTruthy();
  }));
});
