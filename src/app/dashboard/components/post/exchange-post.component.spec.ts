import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExchangePostComponent } from './exchange-post.component';

describe('ExchangePostComponent', () => {
  let component: ExchangePostComponent;
  let fixture: ComponentFixture<ExchangePostComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExchangePostComponent]
    });
    fixture = TestBed.createComponent(ExchangePostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
