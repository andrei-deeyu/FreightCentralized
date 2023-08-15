import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractDatePickerComponent } from './contract-date-picker.component';

describe('PostBidsDatePickerComponent', () => {
  let component: ContractDatePickerComponent;
  let fixture: ComponentFixture<ContractDatePickerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ContractDatePickerComponent]
    });
    fixture = TestBed.createComponent(ContractDatePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
