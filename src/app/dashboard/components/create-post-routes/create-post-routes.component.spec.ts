import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePostRoutesComponent } from './create-post-routes.component';

describe('CreatePostRoutesComponent', () => {
  let component: CreatePostRoutesComponent;
  let fixture: ComponentFixture<CreatePostRoutesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreatePostRoutesComponent]
    });
    fixture = TestBed.createComponent(CreatePostRoutesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
