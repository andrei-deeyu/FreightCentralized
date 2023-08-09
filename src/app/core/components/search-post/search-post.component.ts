import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { debounceTime, distinctUntilChanged, filter, fromEvent, map, switchMap } from 'rxjs';
import { ExchangeApiService } from '../../../dashboard/services/exchange.api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'search-post',
  templateUrl: './search-post.component.html',
  styleUrls: ['./search-post.component.scss']
})
export class SearchPostComponent {
  @Input() isMobile = false;
  @ViewChild('freightSearchInput', { static: true })
  freightSearchInput!: ElementRef;
  arrowkeyLocation = 0;
  apiResponse: any;
  isSearching: boolean;
  successMessage = '';

  constructor(
    private service: ExchangeApiService,
    private router: Router
    ) {
    this.isSearching = false;
    this.apiResponse = [];
  }

  ngAfterViewInit() {
    this.createUserSearchEvent();
  }

  createUserSearchEvent() {
    fromEvent(this.freightSearchInput.nativeElement, 'keyup')
      .pipe(
        map((event: any) => event.target.value),
        filter((res) => res.length > 2),
        debounceTime(200),
        distinctUntilChanged(),
        switchMap((term: string) => {
          this.isSearching = true;
          return this.service.search(term);
        })
      )
      .subscribe({
        next: (res) => {
          this.isSearching = false;
          this.arrowkeyLocation = 0;
          this.apiResponse = res;
        },
        error: (err) => {
          this.isSearching = false;
          console.error('error', err);
        },
      });
  }

  searchReponseSelector(event: KeyboardEvent) {
    switch (event.key) {
      case 'ArrowUp':
        if(this.arrowkeyLocation > 0)
            this.arrowkeyLocation--;
        break;
      case 'ArrowDown':
        if(this.arrowkeyLocation < this.apiResponse.length - 1)
            this.arrowkeyLocation++;
        break;
      case 'Enter':
        this.router.navigate(['/exchange/' + this.apiResponse[this.arrowkeyLocation]._id])
        this.clearSearchReponseSelector();
      }
  }

  clearSearchReponseSelector() {
    this.isSearching = false;
    this.arrowkeyLocation = 0;
    this.apiResponse = null;
    this.freightSearchInput.nativeElement.value = '';
  }
}
