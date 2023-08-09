import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactDataComponent } from './contact-data.component';

describe('ContactDataComponent', () => {
  let component: ContactDataComponent;
  let fixture: ComponentFixture<ContactDataComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ContactDataComponent]
    });
    fixture = TestBed.createComponent(ContactDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
