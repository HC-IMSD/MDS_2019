import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DossierBaseComponent } from './dossier-base.component';

describe('DossierBaseComponent', () => {
  let component: DossierBaseComponent;
  let fixture: ComponentFixture<DossierBaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DossierBaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DossierBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
