import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationInfoBaseComponent } from './application-info-base.component';

describe('ApplicationInfoBaseComponent', () => {
  let component: ApplicationInfoBaseComponent;
  let fixture: ComponentFixture<ApplicationInfoBaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApplicationInfoBaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicationInfoBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
