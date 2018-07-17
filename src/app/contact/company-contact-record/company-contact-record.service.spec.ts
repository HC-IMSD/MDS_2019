import { TestBed, inject } from '@angular/core/testing';

import { CompanyContactRecordService } from './company-contact-record.service';

describe('CompanyContactRecordService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CompanyContactRecordService]
    });
  });

  it('should be created', inject([CompanyContactRecordService], (service: CompanyContactRecordService) => {
    expect(service).toBeTruthy();
  }));
});
