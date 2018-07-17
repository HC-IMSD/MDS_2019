import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyContactRecordComponent } from './company-contact-record.component';

describe('CompanyContactRecordComponent', () => {
  let component: CompanyContactRecordComponent;
  let fixture: ComponentFixture<CompanyContactRecordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyContactRecordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyContactRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
