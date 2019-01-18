import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LicenceRecordComponent } from './licence-record.component';

describe('LicenceRecordComponent', () => {
  let component: LicenceRecordComponent;
  let fixture: ComponentFixture<LicenceRecordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LicenceRecordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LicenceRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
