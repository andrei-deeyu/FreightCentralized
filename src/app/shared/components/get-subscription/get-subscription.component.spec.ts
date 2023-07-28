import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetSubscriptionComponent } from './get-subscription.component';

describe('GetSubscriptionComponent', () => {
  let component: GetSubscriptionComponent;
  let fixture: ComponentFixture<GetSubscriptionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GetSubscriptionComponent]
    });
    fixture = TestBed.createComponent(GetSubscriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
