import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterFileBaseComponent } from './master-file-base.component';

describe('MasterFileBaseComponent', () => {
  let component: MasterFileBaseComponent;
  let fixture: ComponentFixture<MasterFileBaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MasterFileBaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MasterFileBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
