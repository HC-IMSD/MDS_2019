import { TestBed, inject } from '@angular/core/testing';

import { CompanyAdminChangesService } from './company-admin.changes.service';

describe('ApplicationInfo.DetailsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CompanyAdminChangesService]
    });
  });

  it('should be created', inject([CompanyAdminChangesService], (service: CompanyAdminChangesService) => {
    expect(service).toBeTruthy();
  }));
});
