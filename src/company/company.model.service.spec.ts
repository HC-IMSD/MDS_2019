import { TestBed, inject } from '@angular/core/testing';

import { CompanyModelService } from './company.model.service';

describe('CompanyModelService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CompanyModelService]
    });
  });

  it('should be created', inject([CompanyModelService], (service: CompanyModelService) => {
    expect(service).toBeTruthy();
  }));
});
