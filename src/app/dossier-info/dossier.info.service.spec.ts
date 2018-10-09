import { TestBed, inject } from '@angular/core/testing';

import { DossierGenInfoService } from './dossier.info.service';

describe('Dossier.DetailsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DossierGenInfoService]
    });
  });

  it('should be created', inject([DossierGenInfoService], (service: DossierGenInfoService) => {
    expect(service).toBeTruthy();
  }));
});
