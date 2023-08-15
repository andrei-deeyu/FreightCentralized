import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractDataComponent } from './contract-data.component';

describe('ContractsComponent', () => {
  let component: ContractDataComponent;
  let fixture: ComponentFixture<ContractDataComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ContractDataComponent]
    });
    fixture = TestBed.createComponent(ContractDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
