import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LicenceListComponent } from './licence.list.component';

describe('Licence.ListComponent', () => {
  let component: LicenceListComponent;
  let fixture: ComponentFixture<LicenceListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LicenceListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LicenceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
