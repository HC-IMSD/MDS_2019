import { TestBed, inject } from '@angular/core/testing';

import { DeviceDetailsService } from './device.details.service';

describe('Device.DetailsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DeviceDetailsService]
    });
  });

  it('should be created', inject([DeviceDetailsService], (service: DeviceDetailsService) => {
    expect(service).toBeTruthy();
  }));
});
