import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialRecordComponent } from './material-record.component';

describe('MaterialRecordComponent', () => {
  let component: MaterialRecordComponent;
  let fixture: ComponentFixture<MaterialRecordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaterialRecordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
