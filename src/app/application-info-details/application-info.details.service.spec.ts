import { TestBed, inject } from '@angular/core/testing';

import { ApplicationInfoDetailsService } from './application-info.details.service';

describe('ApplicationInfo.DetailsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ApplicationInfoDetailsService]
    });
  });

  it('should be created', inject([ApplicationInfoDetailsService], (service: ApplicationInfoDetailsService) => {
    expect(service).toBeTruthy();
  }));
});
