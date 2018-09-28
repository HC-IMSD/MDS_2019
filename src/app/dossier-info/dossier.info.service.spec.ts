import { TestBed, inject } from '@angular/core/testing';

import { DossierAppInfoService } from './dossier.info.service';

describe('Address.DetailsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DossierAppInfoService]
    });
  });

  it('should be created', inject([DossierAppInfoService], (service: DossierAppInfoService) => {
    expect(service).toBeTruthy();
  }));
});
