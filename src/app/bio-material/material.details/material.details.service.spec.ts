import { TestBed, inject } from '@angular/core/testing';

import { MaterialDetailsService } from './material.details.service';

describe('Material.DetailsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MaterialDetailsService]
    });
  });

  it('should be created', inject([MaterialDetailsService], (service: MaterialDetailsService) => {
    expect(service).toBeTruthy();
  }));
});
