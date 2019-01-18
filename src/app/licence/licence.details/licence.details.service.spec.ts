import { TestBed, inject } from '@angular/core/testing';

import { LicenceDetailsService } from './licence.details.service';

describe('Licence.DetailsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LicenceDetailsService]
    });
  });

  it('should be created', inject([LicenceDetailsService], (service: LicenceDetailsService) => {
    expect(service).toBeTruthy();
  }));
});
