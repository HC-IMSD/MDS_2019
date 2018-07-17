import { TestBed, inject } from '@angular/core/testing';

import { ContactListService } from './contact-list.service';

describe('ContactListService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ContactListService]
    });
  });

  it('should be created', inject([ContactListService], (service: ContactListService) => {
    expect(service).toBeTruthy();
  }));
});
