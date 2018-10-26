import { TestBed, inject } from '@angular/core/testing';

import { MaterialRecordService } from './material-record.service';

describe('MaterialRecordService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MaterialRecordService]
    });
  });

  it('should be created', inject([MaterialRecordService], (service: MaterialRecordService) => {
    expect(service).toBeTruthy();
  }));
});
