import { TestBed, inject } from '@angular/core/testing';

import { PrimaryContactService } from './primary.contact.service';

describe('Address.DetailsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PrimaryContactService]
    });
  });

  it('should be created', inject([PrimaryContactService], (service: PrimaryContactService) => {
    expect(service).toBeTruthy();
  }));
});
