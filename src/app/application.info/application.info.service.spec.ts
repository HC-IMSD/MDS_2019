import { TestBed, inject } from '@angular/core/testing';

import { AddressDetailsService } from './address.details.service';

describe('Address.DetailsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AddressDetailsService]
    });
  });

  it('should be created', inject([AddressDetailsService], (service: AddressDetailsService) => {
    expect(service).toBeTruthy();
  }));
});
