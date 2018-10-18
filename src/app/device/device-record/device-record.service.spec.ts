import { TestBed, inject } from '@angular/core/testing';

import { DeviceRecordService } from './device-record.service';

describe('DeviceRecordService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DeviceRecordService]
    });
  });

  it('should be created', inject([DeviceRecordService], (service: DeviceRecordService) => {
    expect(service).toBeTruthy();
  }));
});
