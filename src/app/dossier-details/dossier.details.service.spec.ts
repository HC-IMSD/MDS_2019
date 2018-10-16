import { TestBed, inject } from '@angular/core/testing';

import { DossierDetailsService } from './dossier.details.service';

describe('Dossier.DetailsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DossierDetailsService]
    });
  });

  it('should be created', inject([DossierDetailsService], (service: DossierDetailsService) => {
    expect(service).toBeTruthy();
  }));
});
