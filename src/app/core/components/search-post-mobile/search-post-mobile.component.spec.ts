import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchPostMobileComponent } from './search-post-mobile.component';

describe('SearchPostMobileComponent', () => {
  let component: SearchPostMobileComponent;
  let fixture: ComponentFixture<SearchPostMobileComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SearchPostMobileComponent]
    });
    fixture = TestBed.createComponent(SearchPostMobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
