import { TestBed, inject } from '@angular/core/testing';

import { RequesterListService } from './requester-list.service';

describe('RequesterListService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RequesterListService]
    });
  });

  it('should be created', inject([RequesterListService], (service: RequesterListService) => {
    expect(service).toBeTruthy();
  }));
});
