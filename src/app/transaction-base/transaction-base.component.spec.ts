import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionBaseComponent } from './transaction-base.component';

describe('TransactionBaseComponent', () => {
  let component: TransactionBaseComponent;
  let fixture: ComponentFixture<TransactionBaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransactionBaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
