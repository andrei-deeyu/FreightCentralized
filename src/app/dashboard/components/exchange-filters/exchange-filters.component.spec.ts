import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExchangeFiltersComponent } from './exchange-filters.component';

describe('ExchangeFiltersComponent', () => {
  let component: ExchangeFiltersComponent;
  let fixture: ComponentFixture<ExchangeFiltersComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExchangeFiltersComponent]
    });
    fixture = TestBed.createComponent(ExchangeFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
