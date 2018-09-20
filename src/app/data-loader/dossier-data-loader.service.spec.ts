import { TestBed, inject } from '@angular/core/testing';

import { DossierDataLoaderService } from './dossier-data-loader.service';

describe('DossierDataLoaderService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DossierDataLoaderService]
    });
  });

  it('should be created', inject([DossierDataLoaderService], (service: DossierDataLoaderService) => {
    expect(service).toBeTruthy();
  }));
});
