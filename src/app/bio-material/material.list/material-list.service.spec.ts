import { TestBed, inject } from '@angular/core/testing';

import { MaterialListService } from './material-list.service';

describe('MaterialListService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MaterialListService]
    });
  });

  it('should be created', inject([MaterialListService], (service: MaterialListService) => {
    expect(service).toBeTruthy();
  }));
});
