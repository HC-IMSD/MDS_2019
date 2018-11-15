import { TestBed, inject } from '@angular/core/testing';

import { RequesterDetailsService } from './requester.details.service';

describe('Requester.DetailsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RequesterDetailsService]
    });
  });

  it('should be created', inject([RequesterDetailsService], (service: RequesterDetailsService) => {
    expect(service).toBeTruthy();
  }));
});
