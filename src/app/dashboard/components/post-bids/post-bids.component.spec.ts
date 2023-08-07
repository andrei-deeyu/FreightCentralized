import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostBidsComponent } from './post-bids.component';

describe('PostBidsComponent', () => {
  let component: PostBidsComponent;
  let fixture: ComponentFixture<PostBidsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PostBidsComponent]
    });
    fixture = TestBed.createComponent(PostBidsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
