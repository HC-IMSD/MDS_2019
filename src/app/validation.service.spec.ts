import { TestBed, inject } from '@angular/core/testing';

import { ValidationService } from './validation.service';

describe('Validation.ServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ValidationService]
    });
  });

  it('should be created', inject([ValidationService], (service: ValidationService) => {
    expect(service).toBeTruthy();
  }));
});
