import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequesterRecordComponent } from './requester-record.component';

describe('RequesterRecordComponent', () => {
  let component: RequesterRecordComponent;
  let fixture: ComponentFixture<RequesterRecordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequesterRecordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequesterRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
