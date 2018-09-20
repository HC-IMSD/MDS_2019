import { TestBed, inject } from '@angular/core/testing';

import { DossierModelService } from './dossier.model.service';

describe('DossierModelService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DossierModelService]
    });
  });

  it('should be created', inject([DossierModelService], (service: DossierModelService) => {
    expect(service).toBeTruthy();
  }));
});
