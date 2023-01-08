import { TestBed, inject } from '@angular/core/testing';

import { MasterFileDetailsService } from './master-file.details.service';

describe('MasterFileDetailsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MasterFileDetailsService]
    });
  });

  it('should be created', inject([MasterFileDetailsService], (service: MasterFileDetailsService) => {
    expect(service).toBeTruthy();
  }));
});
