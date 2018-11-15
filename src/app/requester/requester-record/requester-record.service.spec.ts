import { TestBed, inject } from '@angular/core/testing';

import { RequesterRecordService } from './requester-record.service';

describe('RequesterRecordService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RequesterRecordService]
    });
  });

  it('should be created', inject([RequesterRecordService], (service: RequesterRecordService) => {
    expect(service).toBeTruthy();
  }));
});
