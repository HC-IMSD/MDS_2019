import { TestBed, inject } from '@angular/core/testing';

import { LicenceListService } from './licence-list.service';

describe('LicenceListService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LicenceListService]
    });
  });

  it('should be created', inject([LicenceListService], (service: LicenceListService) => {
    expect(service).toBeTruthy();
  }));
});
