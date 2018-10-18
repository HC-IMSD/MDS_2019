import { TestBed, inject } from '@angular/core/testing';

import { DeviceListService } from './device-list.service';

describe('DeviceListService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DeviceListService]
    });
  });

  it('should be created', inject([DeviceListService], (service: DeviceListService) => {
    expect(service).toBeTruthy();
  }));
});
