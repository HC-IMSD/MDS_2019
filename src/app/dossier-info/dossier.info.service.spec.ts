import { TestBed, inject } from '@angular/core/testing';

import { ApplicationInfoService } from './application.info.service';

describe('Address.DetailsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ApplicationInfoService]
    });
  });

  it('should be created', inject([ApplicationInfoService], (service: ApplicationInfoService) => {
    expect(service).toBeTruthy();
  }));
});
